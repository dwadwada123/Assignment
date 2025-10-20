// Lấy dữ liệu từ các common-utils và cart-manager
import { SHIPPING_FEE, formatCurrency } from "./common-utils.js";
import { CartManager } from "./cart-manager.js";

// Dữ liệu Mã giảm giá
const COUPONS = {
  CYBER20: 200000,
  TECHNEON: 500000,
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
  const couponInput = document
    .getElementById("coupon")
    .value.trim()
    .toUpperCase();
  const couponStatus = document.getElementById("coupon-status");
  const currentSubtotal = CartManager.calculateSubtotal();
  currentDiscount = 0; // Reset giảm giá trước khi áp dụng

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

// Khởi tạo xác thực form
function initializeFormValidation() {
  const form = document.getElementById("CheckoutForm");
  const checkCouponBtn = document.getElementById("check-coupon-btn");

  if (!form || !checkCouponBtn) return;

  checkCouponBtn.addEventListener("click", applyCoupon);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;
    const currentSubtotal = CartManager.calculateSubtotal();

    // Xóa các thông báo lỗi cũ
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    // Kiểm tra họ tên
    if (name === "") {
      document.getElementById("errorName").textContent =
        "Lỗi dữ liệu: Họ tên không được để trống";
      isValid = false;
    }

    // Kiểm tra email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email === "" || !emailPattern.test(email)) {
      document.getElementById("errorEmail").textContent =
        email === ""
          ? "Lỗi dữ liệu: Email không được để trống"
          : "Lỗi định dạng: Email không hợp lệ";
      isValid = false;
    }

    // Kiểm tra số điện thoại
    const phonePattern = /^[0-9]{9,12}$/;
    if (phone === "" || !phonePattern.test(phone)) {
      document.getElementById("errorPhone").textContent =
        phone === ""
          ? "Lỗi dữ liệu: SĐT không được để trống"
          : "Lỗi định dạng: SĐT phải từ 9-12 ký tự số";
      isValid = false;
    }

    // Kiểm tra địa chỉ
    if (address.length < 5) {
      document.getElementById("errorAddress").textContent =
        "Địa chỉ nhận hàng tối thiểu 10 ký tự";
      isValid = false;
    }

    // Kiểm tra giỏ hàng
    if (currentSubtotal === 0) {
      alert("LỖI: Giỏ hàng trống. Không thể thanh toán.");
      isValid = false;
    }

    // Nếu tất cả hợp lệ, hiển thị thông tin đơn hàng
    if (isValid) {
      const finalTotalText = document.getElementById(
        "checkout-grand-total"
      ).textContent;

      alert(`--- GIAO DỊCH HOÀN TẤT ---
Họ tên: ${name}
SĐT: ${phone}
Địa chỉ: ${address}
Giảm giá: ${formatCurrency(currentDiscount)}
TỔNG THANH TOÁN CUỐI CÙNG: ${finalTotalText}

Hệ thống sẽ tiến hành vận chuyển. Giỏ hàng sẽ được xóa.`);

      // Xóa Giỏ hàng và reset trạng thái
      CartManager.clearCart();
      form.reset();
      isLocationVerified = false;
      currentDiscount = 0;
      document.getElementById("coupon-status").textContent = "";

      // Cập nhật giao diện
      renderOrderSummary();
      document.getElementById(
        "geo-info"
      ).innerHTML = `<p>Bấm kích hoạt định vị để xác nhận vị trí giao hàng.</p>
            <div id="map-placeholder">
                <img src="image/map.png" alt="Cyberpunk Map" style="width: 100%; height: auto; border: 1px solid var(--neon-blue);">
            </div>`;
      document.getElementById("nearest-store").innerHTML = "";
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
    infoDiv.innerHTML = `<p>Đang quét tín hiệu vệ tinh...</p>`;

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