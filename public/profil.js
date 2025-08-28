document.addEventListener("DOMContentLoaded", () => {
    // 1. Cek apakah ada data user di localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // 2. Jika tidak ada user, redirect ke halaman login
    if (!user) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    // 3. Ambil elemen HTML yang akan diisi
    const namaEl = document.getElementById("profilNama");
    const emailEl = document.getElementById("profilEmail");
    const nomorHpEl = document.getElementById("profilNomorHp");

    // 4. Isi elemen HTML dengan data user
    if (namaEl) {
        namaEl.textContent = user.nama_lengkap;
    }
    if (emailEl) {
        emailEl.textContent = user.email;
    }
    if (nomorHpEl) {
        nomorHpEl.textContent = user.nomor_hp;
    }
});