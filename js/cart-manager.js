// Lấy key và dữ liệu từ common-utils.js
import { CART_STORAGE_KEY, getProductById } from "./common-utils.js";

// Lấy giỏ hàng từ Local Storage
function getCart() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

// Lưu giỏ hàng vào Local Storage
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Tính tổng tiền hàng (chưa tính ship)
function calculateSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  const cart = getCart();
  const productToAdd = getProductById(productId);

  if (!productToAdd) return false;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productToAdd.id,
      name: productToAdd.name,
      price: productToAdd.price,
      img: productToAdd.img,
      quantity: 1,
    });
  }

  saveCart(cart);
  return productToAdd.name;
}

// Thay đổi số lượng sản phẩm
function changeQuantity(productId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    cart[itemIndex].quantity += delta;

    if (cart[itemIndex].quantity <= 0) {
      // Nếu số lượng <= 0 thì xóa khỏi giỏ hàng
      removeItem(productId);
      return;
    }
  }

  saveCart(cart);
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

// Xuất các hàm để sử dụng ở các file khác
export const CartManager = {
  getCart,
  addToCart,
  removeItem,
  changeQuantity,
  calculateSubtotal,
  clearCart,
};