// login.js
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

if (loginForm && registerForm) {
  // Toggle form
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';

  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }

  // Event listener untuk LOGIN
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (email === "" || password === "") {
      alert("Email dan password wajib diisi!");
      return;
    }

    try {
      const res = await fetch("https://web-hampers-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login gagal!");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login berhasil!");

      if (data.user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "produk.html";
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan koneksi ke server!");
    }
  });

  // ✅ BARU: Event listener untuk REGISTER
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama_lengkap = document.getElementById('registerName').value.trim();
    const nomor_hp = document.getElementById('registerPhone').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!nama_lengkap || !nomor_hp || !email || !password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const res = await fetch("https://web-hampers-production.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_lengkap, nomor_hp, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Registrasi gagal!");
        return;
      }

      alert(data.message);
      // Pindah kembali ke form login setelah pendaftaran berhasil
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';

    } catch (err) {
      console.error("Registrasi error:", err);
      alert("Terjadi kesalahan koneksi ke server!");
    }
  });
}