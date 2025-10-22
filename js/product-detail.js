import { getProductById, formatCurrency, showCustomAlert } from "./common-utils.js";
import { CartManager } from "./cart-manager.js";

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    const container = document.getElementById('product-detail-container');
    const notFoundDiv = document.getElementById('product-not-found');

    if (!productId) {
        container.style.display = 'none';
        notFoundDiv.style.display = 'block';
        return;
    }

    const product = getProductById(productId);
    if (!product) {
        container.style.display = 'none';
        notFoundDiv.style.display = 'block';
        return;
    }

    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-img').src = product.img;
    document.getElementById('detail-img').alt = product.name;
    document.getElementById('detail-category').textContent = product.category;
    document.getElementById('detail-price').textContent = formatCurrency(product.price);
    document.getElementById('detail-desc').textContent = product.description;

    const addButton = document.getElementById('detail-add-to-cart-btn');
    addButton.addEventListener('click', () => {
        CartManager.addToCart(product.id);
        showCustomAlert('THÊM THÀNH CÔNG', `Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    });
});