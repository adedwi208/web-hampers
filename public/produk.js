document.addEventListener("DOMContentLoaded", () => {
    const tabProduk = document.getElementById("tab-produk");
    const tabKemasan = document.getElementById("tab-kemasan");
    const produkSection = document.getElementById("produk-section");
    const kemasanSection = document.getElementById("kemasan-section");
    const produkList = produkSection.querySelector(".produk-list");
    const kemasanList = kemasanSection.querySelector(".produk-list");

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    function createCard(item, kategori) {
        const card = document.createElement("div");
        card.className = "card";

        const hargaFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(item.harga);

        card.innerHTML = `
          <img src="http://localhost:3000/uploads/${item.foto}" alt="${item.nama}">
          <h3>${item.nama}</h3>
          <p>${item.deskripsi}</p>
          <p class="price">Harga: ${hargaFormatted}</p>
          <button class="add-to-cart-btn" data-id="${item.id}" data-kategori="${kategori}">
              ${kategori === 'produk' ? 'Tambah ke Keranjang' : 'Pilih Kemasan'}
          </button>
        `;
        return card;
    }

    async function tambahKeKeranjang(itemId, kategori) {
        try {
            const res = await fetch("http://localhost:3000/api/keranjang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ itemId, kategori }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal menambahkan barang.");
            }
            alert("Barang berhasil ditambahkan ke keranjang!");
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        }
    }

    async function fetchProduk() {
        produkList.innerHTML = "<p>Memuat produk...</p>";
        try {
            const res = await fetch("http://localhost:3000/api/produk", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Gagal mengambil produk");
            }
            const produk = await res.json();
            produkList.innerHTML = "";

            if (produk.length > 0) {
                produk.forEach(p => {
                    const card = createCard(p, 'produk');
                    produkList.appendChild(card);
                });
            } else {
                produkList.innerHTML = "<p>Tidak ada produk yang tersedia saat ini.</p>";
            }
        } catch (error) {
            console.error("Gagal mengambil produk:", error);
            produkList.innerHTML = "<p>Gagal memuat produk. Silakan coba lagi nanti.</p>";
        }
    }

    async function fetchKemasan() {
        kemasanList.innerHTML = "<p>Memuat kemasan...</p>";
        try {
            const res = await fetch("http://localhost:3000/api/produk/kemasan", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Gagal mengambil kemasan");
            }
            const kemasan = await res.json();
            kemasanList.innerHTML = "";

            if (kemasan.length > 0) {
                kemasan.forEach(k => {
                    const card = createCard(k, 'kemasan');
                    kemasanList.appendChild(card);
                });
            } else {
                kemasanList.innerHTML = "<p>Tidak ada kemasan yang tersedia saat ini.</p>";
            }
        } catch (error) {
            console.error("Gagal mengambil kemasan:", error);
            kemasanList.innerHTML = "<p>Gagal memuat kemasan. Silakan coba lagi nanti.</p>";
        }
    }

    // Listener tombol tambah ke keranjang
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart-btn")) {
            const itemId = e.target.dataset.id;
            const itemKategori = e.target.dataset.kategori;
            tambahKeKeranjang(itemId, itemKategori);
        }
    });

    // Tab produk
    tabProduk.addEventListener("click", (e) => {
        e.preventDefault();
        tabProduk.classList.add("active");
        tabKemasan.classList.remove("active");
        produkSection.classList.remove("hidden");
        kemasanSection.classList.add("hidden");
        fetchProduk();
    });

    // Tab kemasan
    tabKemasan.addEventListener("click", (e) => {
        e.preventDefault();
        tabKemasan.classList.add("active");
        tabProduk.classList.remove("active");
        kemasanSection.classList.remove("hidden");
        produkSection.classList.add("hidden");
        fetchKemasan();
    });

    fetchProduk();
});
