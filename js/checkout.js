// Lấy dữ liệu từ các common-utils và cart-manager
import { SHIPPING_FEE, formatCurrency, showCustomAlert } from "./common-utils.js";
import { CartManager } from "./cart-manager.js";

// Dữ liệu Mã giảm giá
const COUPONS = {
  CYBERTECH: 200000,
  PHONGDZ: 1000000,
  NEWUSER: 100000,
};

// Dữ liệu cho Geolocation
const stores = [
  {
    name: "Chi Nhánh Alpha City",
    lat: 10.7769,
    lon: 106.7009,
    address: "Tầng 5, Tòa nhà Bitexco, TP. HCM",
  },
  {
    name: "Chi Nhánh Nebula Delta",
    lat: 21.0285,
    lon: 105.8542,
    address: "Tòa nhà Keangnam, Hà Nội",
  },
  {
    name: "Chi Nhánh Cyber Central",
    lat: 16.0544,
    lon: 108.2022,
    address: "Quận Hải Châu, Đà Nẵng",
  },
];
const EARTH_RADIUS = 6371; // Bán kính Trái Đất (km)
let isLocationVerified = false;
let currentDiscount = 0;

// Kiểm tra trạng thái sẵn sàng thanh toán
function checkCheckoutReadiness() {
  const submitBtn = document.getElementById("checkout-submit-btn");
  const statusMessage = document.getElementById("checkout-status-message");
  const currentSubtotal = CartManager.calculateSubtotal();

  if (currentSubtotal > 0) {
    submitBtn.disabled = false;
    submitBtn.textContent = "XÁC NHẬN THANH TOÁN";
    statusMessage.textContent = "Hệ thống sẵn sàng nhận đơn hàng.";
    statusMessage.style.color = "var(--neon-green)";
  } else if (currentSubtotal === 0) {
    submitBtn.disabled = true;
    statusMessage.textContent = "GIỎ HÀNG TRỐNG. Không thể thanh toán.";
    statusMessage.style.color = "var(--neon-red)";
  } else {
    submitBtn.disabled = true;
    statusMessage.textContent = "LỖI HỆ THỐNG: Vui lòng kiểm tra giỏ hàng.";
    statusMessage.style.color = "var(--neon-red)";
  }
}

// Hiển thị tóm tắt đơn hàng
function renderOrderSummary() {
  const currentSubtotal = CartManager.calculateSubtotal();

  // Tổng cộng
  const totalAmount = currentSubtotal + SHIPPING_FEE - currentDiscount;
  const finalTotal = Math.max(0, totalAmount);

  document.getElementById("checkout-subtotal").textContent =
    formatCurrency(currentSubtotal);
  document.getElementById("checkout-shipping-fee").textContent =
    formatCurrency(SHIPPING_FEE);
  document.getElementById("checkout-discount").textContent =
    formatCurrency(currentDiscount);
  document.getElementById("checkout-grand-total").textContent =
    formatCurrency(finalTotal);

  checkCheckoutReadiness();
}

// Xử lý áp dụng mã giảm giá
function applyCoupon() {
  const couponInput = document.getElementById("coupon").value.trim().toUpperCase();
  const couponStatus = document.getElementById("coupon-status");
  const currentSubtotal = CartManager.calculateSubtotal();
  currentDiscount = 0;

  if (COUPONS.hasOwnProperty(couponInput)) {
    const discountAmount = COUPONS[couponInput];

    // Giảm giá không được vượt quá tổng tiền hàng
    currentDiscount = Math.min(discountAmount, currentSubtotal);

    couponStatus.textContent = `MÃ HỢP LỆ! Giảm ${formatCurrency(
      currentDiscount
    )}`;
    couponStatus.style.color = "var(--neon-green)";
  } else if (couponInput === "") {
    couponStatus.textContent = "";
    currentDiscount = 0;
  } else {
    couponStatus.textContent = "MÃ KHÔNG HỢP LỆ HOẶC ĐÃ HẾT HẠN.";
    couponStatus.style.color = "var(--neon-red)";
    currentDiscount = 0;
  }

  renderOrderSummary();
}

// Khởi tạo kiểm tra form
function initializeFormValidation() {
  const form = document.getElementById("CheckoutForm");
  const checkCouponBtn = document.getElementById("check-coupon-btn");

  // Lấy các ô input
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  // Lấy các ô hiển thị lỗi
  const errorName = document.getElementById("errorName");
  const errorEmail = document.getElementById("errorEmail");
  const errorPhone = document.getElementById("errorPhone");
  const errorAddress = document.getElementById("errorAddress");

  if (!form || !checkCouponBtn) return;

  checkCouponBtn.addEventListener("click", applyCoupon);

  // Hàm kiểm tra Tên
  function validateName() {
    const value = nameInput.value.trim();
    if (value === "") {
      errorName.textContent = "Họ tên không được để trống";
      return false;
    }
    errorName.textContent = "";
    return true;
  }

  // Hàm kiểm tra Email
  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (value === "") {
      errorEmail.textContent = "Email không được để trống";
      return false;
    }
    if (!emailPattern.test(value)) {
      errorEmail.textContent = "Email không hợp lệ";
      return false;
    }
    errorEmail.textContent = "";
    return true;
  }

  // Hàm kiểm tra Số điện thoại
  function validatePhone() {
    const value = phoneInput.value.trim();
    const phonePattern = /^[0-9]{9,12}$/;
    if (value === "") {
      errorPhone.textContent = "SĐT không được để trống";
      return false;
    }
    if (!phonePattern.test(value)) {
      errorPhone.textContent = "SĐT phải từ 9-12 ký tự số";
      return false;
    }
    errorPhone.textContent = "";
    return true;
  }

  // Hàm kiểm tra Địa chỉ
  function validateAddress() {
    const value = addressInput.value.trim();
    if (value.length < 10) {
      errorAddress.textContent = "Địa chỉ nhận hàng tối thiểu 10 ký tự";
      return false;
    }
    errorAddress.textContent = "";
    return true;
  }

  // Hàm kiểm tra sẽ kích hoạt mỗi khi gõ
  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", validateEmail);
  phoneInput.addEventListener("input", validatePhone);
  addressInput.addEventListener("input", validateAddress);

  // Giữ nguyên phần kiểm tra khi submit
  form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    // Chạy tất cả các hàm kiểm tra một lượt cuối cùng
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isAddressValid = validateAddress();

    const currentSubtotal = CartManager.calculateSubtotal();
    
    // Kiểm tra giỏ hàng
    if (currentSubtotal === 0) {
      showCustomAlert('LỖI THANH TOÁN', 'Giỏ hàng trống. Không thể thanh toán.', 'error');
      return; 
    }

    // Nếu tất cả đều hợp lệ, thì mới xử lý đơn hàng
    if (isNameValid && isEmailValid && isPhoneValid && isAddressValid) {
      const finalTotalText = document.getElementById(
        "checkout-grand-total"
      ).textContent;

      const successMessage = `Họ tên: ${nameInput.value.trim()}
SĐT: ${phoneInput.value.trim()}
Địa chỉ: ${addressInput.value.trim()}
Giảm giá: ${formatCurrency(currentDiscount)}

TỔNG THANH TOÁN CUỐI CÙNG: ${finalTotalText}

Hệ thống sẽ tiến hành vận chuyển. Giỏ hàng sẽ được xóa.`;
      
      showCustomAlert('GIAO DỊCH HOÀN TẤT', successMessage, 'success');

      // Xóa Giỏ hàng và reset trạng thái
      CartManager.clearCart();
      form.reset();
      isLocationVerified = false;
      currentDiscount = 0;
      document.getElementById("coupon-status").textContent = "";
      errorName.textContent = "";
      errorEmail.textContent = "";
      errorPhone.textContent = "";
      errorAddress.textContent = "";
      renderOrderSummary();
      document.getElementById(
        "geo-info"
      ).innerHTML = `<p>Bấm kích hoạt định vị để xác nhận vị trí giao hàng.</p>
            <div id="map-placeholder">
                <img src="image/map.png" alt="Cyberpunk Map" style="width: 100%; height: auto; border: 1px solid var(--neon-blue);">
            </div>`;
      document.getElementById("nearest-store").innerHTML = "";
      
    } else {
      showCustomAlert('LỖI DỮ LIỆU', 'Vui lòng kiểm tra lại các thông tin còn thiếu hoặc bị sai.', 'error');
    }
  });
}

// Hàm tính khoảng cách giữa cửa hàng và khách
function getDistance(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  lat1 = lat1 * (Math.PI / 180);
  lat2 = lat2 * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c; // Khoảng cách theo km
}

// Tìm cửa hàng gần nhất
function findNearestStore(userLat, userLon) {
  let nearest = null;
  let minDistance = Infinity;

  stores.forEach((store) => {
    const distance = getDistance(userLat, userLon, store.lat, store.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...store, distance: distance };
    }
  });
  return nearest;
}

// Hàm nếu định vị thành công
function geoSuccess(position) {
  const infoDiv = document.getElementById("geo-info");
  const storeDiv = document.getElementById("nearest-store");
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;

  isLocationVerified = true;

  infoDiv.innerHTML = `<p class="neon-text">Tín hiệu GPS ổn định</p>
                         <p>Tọa độ giao dịch: Lat ${userLat.toFixed(
                           4
                         )}, Lon ${userLon.toFixed(4)}</p>`;

  const nearestStore = findNearestStore(userLat, userLon);
  if (nearestStore) {
    storeDiv.innerHTML = `
            <p style="color: var(--neon-red); font-weight: bold;">CỬA HÀNG GẦN NHẤT ĐƯỢC PHÁT HIỆN:</p>
            <p><strong>${nearestStore.name}</strong></p>
            <p>Địa chỉ: ${nearestStore.address}</p>
            <p>Khoảng cách: ${nearestStore.distance.toFixed(2)} km</p>
        `;
  } else {
    storeDiv.innerHTML = `<p>Không tìm thấy cửa hàng trong mạng lưới.</p>`;
  }

  checkCheckoutReadiness();
}

// Hàm nếu định vị lỗi
function geoError(error) {
  const infoDiv = document.getElementById("geo-info");
  const storeDiv = document.getElementById("nearest-store");

  isLocationVerified = false;
  storeDiv.innerHTML = ""; // Xóa thông tin cửa hàng

  let message = "Lỗi hệ thống định vị.";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Truy cập vị trí bị từ chối.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Thông tin vị trí không khả dụng.";
      break;
    case error.TIMEOUT:
      message = "Yêu cầu định vị đã hết thời gian.";
      break;
    default:
      message = "Lỗi không xác định.";
  }
  infoDiv.innerHTML = `<p class="neon-text-red">LỖI ĐỊNH VỊ: ${message}</p>`;

  checkCheckoutReadiness();
}

// Hàm khởi tạo Geolocation
function initializeGeolocation() {
  const findMeBtn = document.getElementById("find-me-btn");
  if (!findMeBtn) return;

  findMeBtn.addEventListener("click", () => {
    const infoDiv = document.getElementById("geo-info");
    // Thay thế ảnh bằng thông báo quét
    infoDiv.innerHTML = `<p>Đang quét tín hiệu...</p>`;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      });
    } else {
      geoError({ code: 99, message: "Hệ thống không hỗ trợ." });
    }
  });
}

// Chạy tất cả các hàm khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
  initializeFormValidation();
  initializeGeolocation();
});