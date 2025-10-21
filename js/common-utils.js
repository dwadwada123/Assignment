//Lưu các dữ liệu và hàm dùng chung

// Tên key lưu trữ Giỏ hàng
export const CART_STORAGE_KEY = "cyberTechCart";
export const SHIPPING_FEE = 200000;

// Hàm định dạng tiền tệ
export function formatCurrency(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0 VND";
  return amount.toLocaleString("vi-VN") + " VND";
}

// Dữ liệu sản phẩm
const fullTechProducts = [
  {
    id: 1,
    name: "NVIDIA RTX 4090",
    category: "VGA",
    price: 55000000,
    img: "image/VGA4090.jpg",
    description:
      "Card đồ họa mạnh mẽ nhất, hiệu suất ray tracing đỉnh cao cho trải nghiệm gaming 4K.",
  },
  {
    id: 2,
    name: "Intel Core i9-14900K",
    category: "CPU",
    price: 15000000,
    img: "image/IntelCorei914900K.jpg",
    description:
      "Bộ xử lý flagship với kiến trúc Hybrid, tối ưu cho đa nhiệm và sáng tạo nội dung.",
  },
  {
    id: 3,
    name: "G.Skill Trident Z5 RGB 32GB",
    category: "RAM",
    price: 4500000,
    img: "image/GSkillTridentZ5RGB32GB.jpg",
    description:
      "RAM DDR5 tốc độ cao, thiết kế tản nhiệt ánh sáng Neon, tăng cường hiệu năng hệ thống.",
  },
  {
    id: 4,
    name: "Samsung 990 Pro 2TB NVMe",
    category: "SSD",
    price: 6200000,
    img: "image/Samsung990Pro2TBNVMe.jpg",
    description:
      "Ổ cứng NVMe PCIe 4.0, tốc độ đọc/ghi siêu nhanh, giải pháp lưu trữ tối ưu.",
  },
  {
    id: 5,
    name: "Mainboard Z790 AORUS",
    category: "MAINBOARD",
    price: 9800000,
    img: "image/MainboardZ790AORUS.jpg",
    description:
      "Bo mạch chủ cao cấp, hỗ trợ ép xung mạnh mẽ, tích hợp Wi-Fi 7 và nhiều cổng kết nối.",
  },
  {
    id: 6,
    name: "Corsair RM1000x Nguồn",
    category: "PSU",
    price: 3500000,
    img: "image/CorsairRM1000x.jpg",
    description:
      "Nguồn máy tính 1000W 80+ Gold, hiệu suất ổn định và cực kỳ yên tĩnh.",
  },
  {
    id: 7,
    name: "Màn hình OLED LG 34 inch",
    category: "MÀN HÌNH",
    price: 28000000,
    img: "image/OLEDLG34inch.jpg",
    description:
      "Màn hình cong OLED với tần số quét 240Hz, màu sắc rực rỡ và độ tương phản tuyệt đối.",
  },
  {
    id: 8,
    name: "Bàn phím cơ Cyber",
    category: "PHỤ KIỆN",
    price: 2500000,
    img: "image/CyberKey.jpg",
    description:
      "Bàn phím cơ Blue Switch, thiết kế Cyberpunk với đèn nền RGB rực rỡ.",
  },
  {
    id: 9,
    name: "Webcam 4K Streaming",
    category: "PHỤ KIỆN",
    price: 1800000,
    img: "image/Webcam4KStreaming.jpg",
    description:
      "Webcam độ phân giải 4K, micro chống ồn, lý tưởng cho livestream chuyên nghiệp.",
  },
  {
    id: 10,
    name: "Tản nhiệt nước AIO 360mm",
    category: "TẢN NHIỆT",
    price: 3900000,
    img: "image/AIO360mm.jpg",
    description:
      "Hệ thống tản nhiệt chất lỏng 3 quạt, giữ cho CPU luôn mát mẻ dưới tải nặng nhất.",
  },
  {
    id: 11,
    name: "VGA Radeon RX 7900 XT",
    category: "VGA",
    price: 25000000,
    img: "image/VGARadeonRX7900XT.jpg",
    description:
      "Card đồ họa hiệu năng cao từ AMD, cạnh tranh sòng phẳng ở phân khúc cao cấp.",
  },
  {
    id: 12,
    name: "Tai nghe Gaming HyperX",
    category: "PHỤ KIỆN",
    price: 1500000,
    img: "image/GamingHyperX.jpg",
    description:
      "Tai nghe 7.1 Surround Sound, âm thanh rõ nét, micro khử tiếng ồn.",
  },
];

// Export một hàm trả về mảng
export function getProducts() {
  return fullTechProducts;
}

// Export một hàm trả về sản phẩm theo ID
export function getProductById(productId) {
  return fullTechProducts.find((p) => p.id === productId);
}

export function showCustomAlert(title, message, type = 'success') {
    const modal = document.getElementById('global-alert-modal');
    const titleEl = document.getElementById('global-alert-title');
    const messageEl = document.getElementById('global-alert-message');
    const closeBtn = document.getElementById('global-alert-close-btn');
    const modalContent = modal.querySelector('.alert-modal-content');

    // Kiểm tra nếu các element không tồn tại
    if (!modal || !titleEl || !messageEl || !closeBtn) {
        // Nếu không tìm thấy, quay lại dùng alert()
        alert(message);
        return;
    }

    // Cập nhật nội dung
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Cập nhật style
    modalContent.classList.remove('type-success', 'type-error');
    
    if (type === 'error') {
        modalContent.classList.add('type-error');
        titleEl.className = 'neon-text-red';
    } else {
        modalContent.classList.add('type-success');
        titleEl.className = 'neon-text';
    }

    // Hiển thị modal
    modal.style.display = 'flex';

    // Gắn sự kiện đóng
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
}