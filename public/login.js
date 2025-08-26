const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// show/hide form
loginForm.style.display = 'block';
registerForm.style.display = 'none';

showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// 👉 Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (email === "" || password === "") {
    alert("Email dan password wajib diisi!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login berhasil!");

      // simpan token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 cek role
      if (data.user.role === "admin") {
        window.location.href = "admin.html";
      } else if (data.user.role === "peminjam") {
        window.location.href = "peminjam.html";
      } else if (data.user.role === "penyedia") {
        window.location.href = "penyedia.html";
      } else {
        window.location.href = "produk.html"; // fallback
      }

    } else {
      alert(data.message || "Login gagal!");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan koneksi!");
  }
});
