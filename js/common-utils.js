//Lưu các dữ liệu và hàm dùng chung

// Tên key lưu trữ Giỏ hàng
export const CART_STORAGE_KEY = "cyberTechCart";
export const SHIPPING_FEE = 200000;

// Hàm định dạng tiền tệ
export function formatCurrency(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0 VND";
  return amount.toLocaleString("vi-VN") + " VND";
}

const fullTechProducts = [
  {
    id: 1,
    name: "NVIDIA RTX 4090",
    category: "VGA",
    price: 55000000,
    img: "image/VGA4090.jpg",
    description:
      "Card đồ họa mạnh mẽ nhất với kiến trúc Ada Lovelace, 24GB GDDR6X VRAM. Trải nghiệm hiệu suất ray tracing đỉnh cao cho gaming 4K mượt mà và các tác vụ AI. Tích hợp DLSS 3 cho khả năng xử lý hình ảnh vượt trội. Đây là lựa chọn tối thượng cho mọi game thủ và nhà sáng tạo nội dung chuyên nghiệp.",
  },
  {
    id: 2,
    name: "Intel Core i9-14900K",
    category: "CPU",
    price: 15000000,
    img: "image/IntelCorei914900K.jpg",
    description:
      "Bộ xử lý flagship với 24 nhân (8 P-core + 16 E-core) và 32 luồng. Tần số turbo tối đa lên đến 6.0 GHz, mở khóa hiệu năng tối đa cho hệ thống của bạn. Kiến trúc Hybrid tiên tiến tối ưu cho đa nhiệm nặng, streaming và sáng tạo nội dung 8K.",
  },
  {
    id: 3,
    name: "G.Skill Trident Z5 RGB 32GB",
    category: "RAM",
    price: 4500000,
    img: "image/GSkillTridentZ5RGB32GB.jpg",
    description:
      "Kit RAM DDR5 32GB (2x16GB) bus 6000MHz. Thiết kế tản nhiệt nhôm phay xước với dải LED RGB Neon, hỗ trợ XMP 3.0. Tăng cường băng thông và giảm độ trễ, hoàn hảo cho các hệ thống gaming cao cấp và ép xung (overclocking).",
  },
  {
    id: 4,
    name: "Samsung 990 Pro 2TB NVMe",
    category: "SSD",
    price: 6200000,
    img: "image/Samsung990Pro2TBNVMe.jpg",
    description:
      "Ổ cứng SSD NVMe M.2 2TB, chuẩn PCIe 4.0. Tốc độ đọc/ghi tuần tự lên đến 7,450/6,900 MB/s. Giải pháp lưu trữ tối ưu cho gaming và các ứng dụng chuyên nghiệp, giảm thời gian tải game và khởi động hệ thống chỉ trong vài giây.",
  },
  {
    id: 5,
    name: "Mainboard Z790 AORUS",
    category: "MAINBOARD",
    price: 9800000,
    img: "image/MainboardZ790AORUS.jpg",
    description:
      "Bo mạch chủ cao cấp socket LGA 1700, hỗ trợ CPU Intel thế hệ 12, 13 và 14. Thiết kế VRM mạnh mẽ, hỗ trợ ép xung mạnh mẽ, tích hợp Wi-Fi 7 và LAN 2.5GbE. Nhiều khe cắm M.2 PCIe 5.0 và hệ thống tản nhiệt M.2 tiên tiến.",
  },
  {
    id: 6,
    name: "Corsair RM1000x Nguồn",
    category: "PSU",
    price: 3500000,
    img: "image/CorsairRM1000x.jpg",
    description:
      "Nguồn máy tính 1000W, đạt chuẩn 80+ Gold, Full Modular. Cung cấp hiệu suất ổn định và cực kỳ yên tĩnh nhờ quạt tản nhiệt từ tính. Tụ điện Nhật Bản cao cấp đảm bảo độ bền bỉ và an toàn cho toàn bộ hệ thống của bạn.",
  },
  {
    id: 7,
    name: "Màn hình OLED LG 34 inch",
    category: "MÀN HÌNH",
    price: 28000000,
    img: "image/OLEDLG34inch.jpg",
    description:
      "Màn hình cong UltraWide™ 34 inch tỷ lệ 21:9. Công nghệ tấm nền OLED với tần số quét 240Hz, thời gian phản hồi 0.03ms. Màu sắc rực rỡ, độ tương phản tuyệt đối và màu đen hoàn hảo, mang lại trải nghiệm HDR đắm chìm.",
  },
  {
    id: 8,
    name: "Bàn phím cơ Cyber",
    category: "PHỤ KIỆN",
    price: 2500000,
    img: "image/CyberKey.jpg",
    description:
      "Bàn phím cơ Blue Switch cho cảm giác gõ 'clicky' đặc trưng. Thiết kế Cyberpunk độc đáo với keycap PBT xuyên LED. Hệ thống đèn nền RGB 16.8 triệu màu có thể tùy chỉnh qua phần mềm, khung kim loại chắc chắn.",
  },
  {
    id: 9,
    name: "Webcam 4K Streaming",
    category: "PHỤ KIỆN",
    price: 1800000,
    img: "image/Webcam4KStreaming.jpg",
    description:
      "Webcam độ phân giải 4K 30fps (hoặc 1080p 60fps), lý tưởng cho livestream chuyên nghiệp. Cảm biến cao cấp cho hình ảnh sắc nét ngay cả trong điều kiện thiếu sáng. Tích hợp micro kép chống ồn và lấy nét tự động bằng AI.",
  },
  {
    id: 10,
    name: "Tản nhiệt nước AIO 360mm",
    category: "TẢN NHIỆT",
    price: 3900000,
    img: "image/AIO360mm.jpg",
    description:
      "Hệ thống tản nhiệt chất lỏng 3 quạt ARGB 120mm. Mặt bơm (pump) thiết kế vô cực (infinity mirror) ấn tượng. Giữ cho CPU luôn mát mẻ dưới tải nặng nhất, đồng bộ LED với mainboard qua các chuẩn ARGB phổ biến.",
  },
  {
    id: 11,
    name: "VGA Radeon RX 7900 XT",
    category: "VGA",
    price: 25000000,
    img: "image/VGARadeonRX7900XT.jpg",
    description:
      "Card đồ họa hiệu năng cao từ AMD với kiến trúc RDNA 3, 20GB GDDR6 VRAM. Cạnh tranh sòng phẳng ở phân khúc cao cấp, hỗ trợ công nghệ AMD FSR 3.0 và ray tracing. Lựa chọn tuyệt vời cho gaming 1440p và 4K.",
  },
  {
    id: 12,
    name: "Tai nghe Gaming HyperX",
    category: "PHỤ KIỆN",
    price: 1500000,
    img: "image/GamingHyperX.jpg",
    description:
      "Tai nghe 7.1 Surround Sound giả lập, mang lại âm thanh rõ nét và định vị chính xác. Mút tai nghe bọc da mềm mại, khung thép bền bỉ. Micro khử tiếng ồn có thể tháo rời, tương thích đa nền tảng (PC, Console).",
  },
];

// Export dữ liệu thông qua hàm
export function getProducts() {
  return fullTechProducts;
}

// Export dữ liệu theo ID qua hàm
export function getProductById(productId) {
  return fullTechProducts.find((p) => p.id === productId);
}

export function showCustomAlert(title, message, type = 'success') {
    const modal = document.getElementById('global-alert-modal');
    const titleEl = document.getElementById('global-alert-title');
    const messageEl = document.getElementById('global-alert-message');
    const closeBtn = document.getElementById('global-alert-close-btn');
    const modalContent = modal.querySelector('.alert-modal-content');

    if (!modal || !titleEl || !messageEl || !closeBtn) {
        alert(message);
        return;
    }

    titleEl.textContent = title;
    messageEl.textContent = message;
    
    modalContent.classList.remove('type-success', 'type-error');
    
    if (type === 'error') {
        modalContent.classList.add('type-error');
        titleEl.className = 'neon-text-red'; 
    } else {
        modalContent.classList.add('type-success');
        titleEl.className = 'neon-text'; 
    }

    modal.style.display = 'flex';

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
}