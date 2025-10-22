// Lấy dữ liệu từ common-utils.js và cart-manager.js
import { getProducts, getProductById, formatCurrency, showCustomAlert } from "./common-utils.js";
import { CartManager } from "./cart-manager.js";

// Lấy các phần tử DOM chính
const productCatalogue = document.getElementById("full-product-catalogue");
const searchInput = document.getElementById("product-search-input");
const fullProductList = getProducts();

function renderProductList(products) {
    productCatalogue.innerHTML = "";

    if (products.length === 0) {
        productCatalogue.innerHTML = `<p class="neon-text-red" style="text-align: center; grid-column: 1 / -1;">Không tìm thấy linh kiện nào phù hợp.</p>`;
        return;
    }

    products.forEach((p) => {
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
                <button class="btn quick-view-btn" data-id="${p.id}">XEM CHI TIẾT</button>
                <button class="btn add-to-cart-btn" data-id="${p.id}">THÊM VÀO GIỎ</button>
            </div>
        `;
        productCatalogue.appendChild(card);
    });
}

// Thêm sản phẩm vào giỏ hàng và hiển thị thông báo
function handleAddToCart(productId) {
    const productName = CartManager.addToCart(productId);
    if (productName) {
        showCustomAlert('THÊM THÀNH CÔNG', `${productName} đã được thêm vào giỏ hàng!`, 'success');
    }
}

// Gắn sự kiện cho các nút
function attachEventListeners() {
    const modal = document.getElementById("quick-view-modal");
    const closeBtn = document.querySelector(".close-btn");
    const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");

    if (!productCatalogue) return;

    // Listener cho toàn bộ danh sách sản phẩm
    productCatalogue.addEventListener('click', (e) => {
        const target = e.target;

        // Xử lý nút "XEM CHI TIẾT"
        if (target.classList.contains('quick-view-btn')) {
            const productId = parseInt(target.dataset.id);
            const product = getProductById(productId);

            if (product) {
                document.getElementById("modal-name").textContent = product.name;
                document.getElementById("modal-img").src = product.img;
                document.getElementById("modal-category").textContent = product.category;
                document.getElementById("modal-price").textContent = formatCurrency(product.price);
                document.getElementById("modal-description").textContent = product.description; 
                modalAddToCartBtn.setAttribute("data-id", product.id);
                modal.style.display = "block";
            }
        }

        // Xử lý nút "THÊM VÀO GIỎ"
        if (target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(target.dataset.id);
            handleAddToCart(productId);
        }
    });

    // Giữ nguyên logic xử lý đóng modal
    if(closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    if(modal) {
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    if(modalAddToCartBtn) {
        // Xử lý nút Thêm vào giỏ hàng trong modal
        modalAddToCartBtn.addEventListener("click", (e) => {
            const productId = parseInt(e.target.dataset.id);
            handleAddToCart(productId);
            modal.style.display = "none";
        });
    }
}

// Hàm xử lý sự kiện tìm kiếm
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Lọc danh sách sản phẩm
    const filteredProducts = fullProductList.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) || 
               product.category.toLowerCase().includes(searchTerm);
    });

    renderProductList(filteredProducts);
}

// Khởi chạy khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
    if (!productCatalogue) {
        console.error("Không tìm thấy #full-product-catalogue.");
        return;
    }

    renderProductList(fullProductList);
    attachEventListeners();
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    } else {
        console.error("Không tìm thấy #product-search-input.");
    }
});