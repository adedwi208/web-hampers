document.addEventListener("DOMContentLoaded", () => {
    const keranjangList = document.getElementById("keranjangList");
    const totalHargaEl = document.getElementById("totalHarga");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const modal = document.getElementById("checkoutModal");
    const closeModal = document.querySelector(".modal .close");
    const checkoutForm = document.getElementById("checkoutForm");
    const token = localStorage.getItem("token");

    let totalHarga = 0;

    async function loadKeranjang() {
        keranjangList.innerHTML = "<p>Memuat keranjang...</p>";
        try {
            const res = await fetch("http://localhost:3000/api/keranjang", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Gagal mengambil data keranjang");
            const cartItems = await res.json();

            keranjangList.innerHTML = "";
            totalHarga = 0;

            if (cartItems.length === 0) {
                keranjangList.innerHTML = "<p style='text-align:center;'>Keranjang Anda kosong.</p>";
                totalHargaEl.textContent = 'Rp 0';
                return;
            }

            cartItems.forEach(item => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <img src="http://localhost:3000/uploads/${item.foto_item}" alt="${item.nama_item}">
                    <h3>${item.nama_item}</h3>
                    <p>Jumlah: ${item.jumlah}</p>
                    <p>Harga: Rp ${item.harga_satuan.toLocaleString('id-ID')}</p>
                    <button class="hapus-btn" data-id="${item.id}">Hapus</button>
                `;
                keranjangList.appendChild(card);
                totalHarga += parseFloat(item.harga_satuan) * item.jumlah;
            });

            totalHargaEl.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;

            document.querySelectorAll('.hapus-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    if (!confirm("Yakin ingin menghapus barang ini?")) return;
                    try {
                        const res2 = await fetch(`http://localhost:3000/api/keranjang/${id}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (!res2.ok) throw new Error("Gagal menghapus.");
                        alert("Barang berhasil dihapus!");
                        loadKeranjang();
                    } catch (err) {
                        alert("Gagal menghapus barang.");
                    }
                });
            });

        } catch (error) {
            console.error(error);
            keranjangList.innerHTML = "<p style='text-align:center;'>Gagal memuat keranjang.</p>";
        }
    }

    // ✅ Tambahan: tombol Checkout buka modal
    checkoutBtn.addEventListener("click", () => {
        if (totalHarga <= 0) {
        alert("Keranjang Anda kosong. Tidak bisa checkout!");
        return;
    }
        checkoutForm.reset();
        checkoutForm.order_id.value = 'ORD' + Date.now();
        modal.style.display = "block";
    });

    // ✅ Tambahan: tombol close modal & klik luar modal
    if (closeModal) {
        closeModal.addEventListener("click", () => modal.style.display = "none");
    }
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // Submit form checkout
    checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(checkoutForm);
        const data = Object.fromEntries(formData.entries());
        data.total_amount = totalHarga;

        try {
            const res = await fetch("http://localhost:3000/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (res.ok) {
                document.getElementById('resiText').textContent = result.resi;
                document.getElementById('metodeText').textContent = result.metode_pembayaran || data.payment_method;
                const adminLink = document.getElementById('adminPhoneLink');
                adminLink.textContent = result.admin_no;
                adminLink.href = `https://wa.me/${result.admin_no.replace(/\D/g,'')}`;
                document.getElementById('checkoutResult').style.display = 'block';

                modal.style.display = "none"; // ✅ tutup modal setelah sukses
                loadKeranjang();
                alert("Pesanan berhasil! Resi: " + result.resi + "\nHubungi admin: " + result.admin_no);
            } else {
                alert("Gagal melakukan pembayaran: " + (result.message || result.error));
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat pembayaran.");
        }
    });

    loadKeranjang();
});
