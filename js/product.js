// Lấy dữ liệu từ common-utils.js và cart-manager.js
import { getProducts, getProductById, formatCurrency, showCustomAlert } from "./common-utils.js";
import { CartManager } from "./cart-manager.js";

// Hiển thị tất cả sản phẩm
function renderProducts() {
  const productCatalogue = document.getElementById("full-product-catalogue");
  if (!productCatalogue) return;

  productCatalogue.innerHTML = "";
  
  // Dùng hàm getProducts()
  getProducts().forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card product-item";
    card.setAttribute("data-id", p.id);

    card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>Loại: ${p.category}</p>
                <p class="price neon-text-red">${formatCurrency(p.price)}</p>
            </div>
            <div class="product-overlay">
                <button class="btn quick-view-btn" data-id="${
                  p.id
                }">XEM CHI TIẾT</button>
                <button class="btn add-to-cart-btn" data-id="${
                  p.id
                }">THÊM VÀO GIỎ</button>
            </div>
        `;
    productCatalogue.appendChild(card);
  });

  attachEventListeners(productCatalogue); // Truyền thẻ cha vào
}

// Thêm sản phẩm vào giỏ hàng và hiển thị thông báo
function handleAddToCart(productId) {
  const productName = CartManager.addToCart(productId);
  if (productName) {
    showCustomAlert('THÊM THÀNH CÔNG', `${productName} đã được thêm vào giỏ hàng!`, 'success');
  }
}

// Gắn sự kiện cho các nút
function attachEventListeners(productCatalogue) { // Nhận thẻ cha
  const modal = document.getElementById("quick-view-modal");
  const closeBtn = document.querySelector(".close-btn");
  const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");

  productCatalogue.addEventListener('click', (e) => {
    const target = e.target;
    
    // Kiểm tra xem có phải nút "XEM CHI TIẾT" không
    if (target.classList.contains('quick-view-btn')) {
      const productId = parseInt(target.dataset.id);
      const product = getProductById(productId);

      if (product) {
        document.getElementById("modal-name").textContent = product.name;
        document.getElementById("modal-img").src = product.img;
        document.getElementById("modal-category").textContent =
          product.category;
        document.getElementById("modal-price").textContent = formatCurrency(
          product.price
        );
        document.querySelector(".modal-description").textContent =
          product.description;

        modalAddToCartBtn.setAttribute("data-id", product.id);
        modal.style.display = "block";
      }
    }
    
    // Kiểm tra xem có phải nút "THÊM VÀO GIỎ" không
    if (target.classList.contains('add-to-cart-btn')) {
       const productId = parseInt(target.dataset.id);
       handleAddToCart(productId);
    }
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Xử lý nút Thêm vào giỏ hàng trong modal
  modalAddToCartBtn.addEventListener("click", (e) => {
    const productId = parseInt(e.target.dataset.id);
    handleAddToCart(productId);
    modal.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", renderProducts);