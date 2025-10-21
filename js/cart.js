// Lấy key và dữ liệu từ common-utils.js và cart-manager.js
import { SHIPPING_FEE, formatCurrency } from "./common-utils.js";
import { CartManager } from "./cart-manager.js";

//Hiển thị giỏ hàng và tính toán tổng tiền

export function renderCart() {
  const cart = CartManager.getCart(); // Lấy giỏ hàng từ cart-manager.js
  const cartTableBody = document.querySelector("#cart-table tbody");
  const subtotalElement = document.getElementById("cart-subtotal");
  const grandTotalElement = document.getElementById("cart-grand-total");
  const emptyMessage = document.getElementById("empty-cart-message");
  const cartSummary = document.querySelector(".cart-summary");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // Kiểm tra tất cả các phần tử có trống không
  if (
    !cartTableBody ||
    !cartSummary ||
    !checkoutBtn ||
    !subtotalElement ||
    !grandTotalElement ||
    !emptyMessage
  )
    return;

  cartTableBody.innerHTML = "";
  const subtotal = CartManager.calculateSubtotal(); // Tính tổng tiền hàng
  const grandTotal = subtotal + SHIPPING_FEE;

  if (cart.length === 0) {
    // Ẩn bảng và nút thanh toán, hiển thị thông báo trống
    emptyMessage.style.display = "block";
    cartSummary.style.display = "none";
    checkoutBtn.style.display = "none";
    // Phí ship = 0 khi giỏ hàng trống
    document.getElementById("shipping-fee").textContent = formatCurrency(0);
  } else {
    // Nếu có sản phẩm, hiển thị các phần tử
    emptyMessage.style.display = "none";
    cartSummary.style.display = "block";
    checkoutBtn.style.display = "block";
    document.getElementById("shipping-fee").textContent =
      formatCurrency(SHIPPING_FEE);

    cart.forEach((item) => {
      const productId = item.id;
      const itemTotal = item.price * item.quantity;

      const row = document.createElement("tr");

      row.innerHTML = `
                <td><img src="${item.img}" alt="${item.name}"></td>
                <td style="text-align: left;">${item.name}</td>
                <td class="neon-text">${formatCurrency(item.price)}</td>
                <td>
                    <div class="qty-control">
                        <button class="qty-btn" data-id="${productId}" data-delta="-1">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" data-id="${productId}" data-delta="1">+</button>
                    </div>
                </td>
                <td class="neon-text-red">${formatCurrency(itemTotal)}</td>
                <td><button class="remove-btn" data-id="${productId}">XÓA</button></td>
            `;

      cartTableBody.appendChild(row);
    });
  }

  // Cập nhật tổng tiền
  subtotalElement.textContent = formatCurrency(subtotal);
  grandTotalElement.textContent = formatCurrency(grandTotal);

  // Gắn sự kiện
  attachEventListeners(cartTableBody);
}

//Xử lý sự kiện
function attachEventListeners(container) {
  // Listener cho nút tăng/giảm và xóa sản phẩm
  container.removeEventListener("click", handleCartAction);
  container.addEventListener("click", handleCartAction);

  // Listener cho nút Thanh toán
  document
    .querySelector(".checkout-btn")
    ?.removeEventListener("click", handleCheckoutRedirect);
  document
    .querySelector(".checkout-btn")
    ?.addEventListener("click", handleCheckoutRedirect);
}

// Chuyển sang trang Thanh toán nhấn nút Thanh toán
function handleCheckoutRedirect(e) {
  e.preventDefault();
  window.location.href = "checkout.html";
}

// Hàm xử lý sự kiện tăng/giảm số lượng và xóa sản phẩm
function handleCartAction(e) {
  const target = e.target;
  const productId = Number(target.dataset.id);

  // Kiểm tra nếu productId hợp lệ và nút được nhấn là nút tăng/giảm hoặc xóa
  if (
    isNaN(productId) ||
    (!target.classList.contains("qty-btn") &&
      !target.classList.contains("remove-btn"))
  ) {
    return;
  }

  if (target.classList.contains("qty-btn")) {
    const delta = Number(target.dataset.delta);
    CartManager.changeQuantity(productId, delta);
    renderCart(); // Tải lại sau khi thay đổi số lượng
  } else if (target.classList.contains("remove-btn")) {
    CartManager.removeItem(productId);
    renderCart(); // Tải lại sau khi xóa
  }
}

document.addEventListener("DOMContentLoaded", renderCart);