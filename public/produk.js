// Tab switching logic
document.addEventListener("DOMContentLoaded", () => {
  const tabProduk = document.getElementById("tab-produk");
  const tabKemasan = document.getElementById("tab-kemasan");
  const produkSection = document.getElementById("produk-section");
  const kemasanSection = document.getElementById("kemasan-section");
  
  document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
  }
});

  tabProduk.addEventListener("click", (e) => {
    e.preventDefault();
    tabProduk.classList.add("active");
    tabKemasan.classList.remove("active");
    produkSection.classList.remove("hidden");
    kemasanSection.classList.add("hidden");
  });

  tabKemasan.addEventListener("click", (e) => {
    e.preventDefault();
    tabKemasan.classList.add("active");
    tabProduk.classList.remove("active");
    kemasanSection.classList.remove("hidden");
    produkSection.classList.add("hidden");
  });
});
