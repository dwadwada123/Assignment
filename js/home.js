// Lấy dữ liệu từ common-utils.js và cart-manager.js
import { fullTechProducts, formatCurrency } from "./common-utils.js";
import { CartManager } from "./cart-manager.js";

// Chỉ lấy 8 sản phẩm đầu tiên cho trang chủ
const homePageProducts = fullTechProducts.slice(0, 8);

// Hiển thị sản phẩm
function loadProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  homePageProducts.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>Loại: ${p.category}</p>
                <p class="price">${formatCurrency(p.price)}</p>
                <a href="#" class="btn add-to-cart-btn" data-product-id="${
                  p.id
                }">THÊM VÀO GIỎ</a>
            </div>
        `;

    // Xử lý sự kiện thêm vào giỏ hàng
    const addButton = card.querySelector(".add-to-cart-btn");
    addButton.addEventListener("click", (e) => {
      e.preventDefault();

      const productId = parseInt(e.currentTarget.dataset.productId);
      const productName = CartManager.addToCart(productId);

      if (productName) {
        console.log(`Đã thêm ${productName} vào giỏ hàng.`);
        alert(`Đã thêm ${productName} vào giỏ hàng!`);
      }
    });

    productList.appendChild(card);
  });
}

// Khởi tạo slider
function initializeSlider() {
  const slider = document.getElementById("holo-slider");
  const slides = Array.from(slider.querySelectorAll(".holo-slide"));
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const dotsContainer = document.getElementById("slider-dots");
  let currentSlideIndex = 0;
  let autoSlideInterval;

  if (!slider) return;

  // Khởi tạo Dots
  slides.forEach((slide, index) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.querySelectorAll(".dot"));

  // Hàm chuyển slide
  function goToSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    currentSlideIndex = index;

    const offset = -currentSlideIndex * 100;
    slider.style.transform = `translateX(${offset}%)`;

    // Cập nhật dots
    dots.forEach((d) => d.classList.remove("active"));
    dots[currentSlideIndex].classList.add("active");
  }

  // Tự động chuyển slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Xử lý nút Next/Prev
  prevBtn.addEventListener("click", () => {
    goToSlide(currentSlideIndex - 1);
    resetAutoSlide();
  });
  nextBtn.addEventListener("click", () => {
    goToSlide(currentSlideIndex + 1);
    resetAutoSlide();
  });

  startAutoSlide();
}

// Khởi tạo đồng hồ đếm ngược Flash Sale
function initializeCountdown() {
  const countdownElement = document.getElementById("countdown-clock");
  if (!countdownElement) return;

  // Thiết lập ngày kết thúc Flash Sale
  const endTime = new Date();
  endTime.setDate(endTime.getDate() + 3);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = endTime - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      clearInterval(countdownInterval);
      countdownElement.innerHTML = "SALE ĐÃ KẾT THÚC!";
    } else {
      document.getElementById("days").innerText = String(days).padStart(2, "0");
      document.getElementById("hours").innerText = String(hours).padStart(
        2,
        "0"
      );
      document.getElementById("minutes").innerText = String(minutes).padStart(
        2,
        "0"
      );
      document.getElementById("seconds").innerText = String(seconds).padStart(
        2,
        "0"
      );
    }
  };

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

// Chạy tất cả các hàm khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  initializeSlider();
  initializeCountdown();
});