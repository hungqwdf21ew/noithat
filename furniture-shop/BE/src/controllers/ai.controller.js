const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const ProductModel = require('../models/product.model');

// ── Đường dẫn thư mục ảnh nền trong suốt (FE public) ──────────────────────
const IMAGES_NEN_DIR = path.join(
  __dirname, '..', '..', '..', '..', 'FE', 'client', 'public', 'images_nen'
);

/**
 * Từ HinhAnhChinh (vd: /images/sofa-heritage-royale.png)
 * → suy ra tên file trong images_nen (vd: sofa-heritage-royale.png)
 * Kiểm tra file có tồn tại không, nếu không thử các biến thể.
 */
function findTransparentImage(hinhAnhChinh) {
  if (!hinhAnhChinh) return null;

  // Lấy tên file không có path
  const baseName = path.basename(hinhAnhChinh); // vd: sofa-heritage-royale.png

  // Danh sách các tên cần thử theo thứ tự ưu tiên
  const candidates = [baseName];

  // Thử không có phần số ở cuối: sofa-heritage-royale_1.png → sofa-heritage-royale.png
  const withoutSuffix = baseName.replace(/_\d+(\.\w+)$/, '$1');
  if (withoutSuffix !== baseName) candidates.push(withoutSuffix);

  // Thử với _1.png
  const withSuffix = baseName.replace(/(\.\w+)$/, '_1$1');
  candidates.push(withSuffix);

  // Kiểm tra từng ứng viên
  for (const candidate of candidates) {
    const fullPath = path.join(IMAGES_NEN_DIR, candidate);
    if (fs.existsSync(fullPath)) {
      return { fileName: candidate, fullPath };
    }
  }

  return null;
}

/**
 * Đọc file ảnh local → base64 data URL
 */
function imageFileToBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mimeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
  const mime = mimeMap[ext] || 'image/png';
  const buffer = fs.readFileSync(filePath);
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

/**
 * Tải ảnh từ URL (hỗ trợ redirect)
 */
function downloadImage(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));

    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 90000,
    };

    const chunks = [];
    const req = client.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadImage(res.headers.location, redirectCount + 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    req.end();
  });
}

/**
 * Xác định loại phòng phù hợp dựa trên danh mục + tên sản phẩm
 */
function inferRoomContext(p1, p2) {
  const allText = [
    p1.TenSanPham, p1.TenDanhMuc, p1.TenPhong,
    p2.TenSanPham, p2.TenDanhMuc, p2.TenPhong,
  ].join(' ').toLowerCase();

  if (allText.includes('giường') || allText.includes('phòng ngủ')) {
    return {
      room: 'bedroom',
      bg: 'elegant bedroom with warm ambient lighting, tufted headboard wall, silk curtains, parquet floor',
    };
  }
  if (allText.includes('bàn ăn') || allText.includes('phòng ăn') || allText.includes('ghế ăn')) {
    return {
      room: 'dining room',
      bg: 'grand dining room with high ceiling, crystal chandelier, marble floor, wainscoting walls',
    };
  }
  if (allText.includes('bàn làm việc') || allText.includes('phòng làm việc') || allText.includes('ghế văn phòng')) {
    return {
      room: 'home office',
      bg: 'luxury home office with floor-to-ceiling bookshelves, leather accents, warm desk lamp',
    };
  }
  // Mặc định: phòng khách
  return {
    room: 'living room',
    bg: 'opulent living room with gold-trimmed moldings, herringbone parquet floor, sheer white curtains, soft afternoon light through tall windows',
  };
}

/**
 * Xác định phong cách thiết kế từ phong cách sản phẩm
 */
function inferStyle(p1, p2) {
  const styles = [p1.TenPhongCach, p2.TenPhongCach].filter(Boolean).join(' ').toLowerCase();

  if (styles.includes('hoàng gia') || styles.includes('royal') || styles.includes('imperial')) {
    return 'Royal baroque opulent style, deep jewel tones, heavy drapery, gilded accents';
  }
  if (styles.includes('tân cổ điển') || styles.includes('tan co dien')) {
    return 'Neoclassical style, symmetrical layout, cream and gold palette, refined elegance';
  }
  if (styles.includes('cổ điển') || styles.includes('co dien')) {
    return 'Classic European style, ornate carved woodwork, warm amber lighting';
  }
  if (styles.includes('hiện đại') || styles.includes('modern') || styles.includes('luxury modern')) {
    return 'Modern luxury style, clean lines, neutral tones, statement lighting';
  }
  if (styles.includes('tối giản') || styles.includes('japandi') || styles.includes('minimal')) {
    return 'Japandi minimalist style, natural materials, muted earth tones, zen atmosphere';
  }
  return 'Luxury transitional style, timeless elegance, warm neutral palette';
}

/**
 * Tạo prompt chi tiết từ thông tin sản phẩm DB
 */
function buildPrompt(p1, p2) {
  const roomCtx = inferRoomContext(p1, p2);
  const styleDesc = inferStyle(p1, p2);

  const describeProduct = (p, position) => {
    const parts = [];
    // Tên sản phẩm Việt → bổ sung từ tiếng Anh dễ hiểu cho AI
    parts.push(p.TenSanPham);
    if (p.MauSac) parts.push(`${p.MauSac} color`);
    if (p.ChatLieu) parts.push(`${p.ChatLieu} material`);
    if (p.TenPhongCach) parts.push(`${p.TenPhongCach} style`);
    return `${parts.join(', ')} positioned ${position} of the room`;
  };

  const promtParts = [
    // Chủ đề chính
    `Photorealistic 4K ultra-detailed luxury interior design photography`,
    // Bối cảnh phòng
    `${roomCtx.bg}`,
    // Phong cách
    `${styleDesc}`,
    // Mô tả từng sản phẩm
    `${describeProduct(p1, 'prominently on the left side')}`,
    `${describeProduct(p2, 'elegantly on the right side')}`,
    // Yêu cầu kỹ thuật ảnh
    `Both furniture pieces naturally integrated into the scene`,
    `Depth of field, volumetric lighting, realistic shadows and reflections`,
    `Shot with wide-angle lens, magazine-quality composition`,
    `Professional architectural photography, award-winning interior design`,
    // Negative
    `No text overlay, no watermark, no people, no CGI look`,
  ];

  return promtParts.join('. ');
}

/**
 * Gọi Pollinations với model cụ thể, timeout riêng
 */
function callPollinations(prompt, model, width, height, seed) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true&model=${model}&seed=${seed}&negative=cartoon,text,watermark,ugly,blurry,low+quality`;
  console.log(`[AI] Calling Pollinations model=${model}...`);
  return downloadImage(url);
}

/**
 * POST /api/ai/bundle-image
 * Body: { productId1: number, productId2: number }
 */
exports.generateBundleImage = async (req, res) => {
  try {
    const { productId1, productId2 } = req.body;

    if (!productId1 || !productId2) {
      return res.status(400).json({ success: false, message: 'Thiếu productId1 hoặc productId2.' });
    }

    // ── 1. Lấy dữ liệu sản phẩm từ DB ─────────────────────────────────────
    console.log('[AI] Fetching products:', productId1, productId2);
    const [p1, p2] = await Promise.all([
      ProductModel.findById(productId1),
      ProductModel.findById(productId2),
    ]);

    if (!p1) return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm ID ${productId1}.` });
    if (!p2) return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm ID ${productId2}.` });

    console.log('[AI] Products:', p1.TenSanPham, '+', p2.TenSanPham);

    // ── 2. Tìm ảnh trong suốt trong images_nen ─────────────────────────────
    const img1Info = findTransparentImage(p1.HinhAnhChinh);
    const img2Info = findTransparentImage(p2.HinhAnhChinh);

    console.log('[AI] Transparent img1:', img1Info ? img1Info.fileName : 'NOT FOUND');
    console.log('[AI] Transparent img2:', img2Info ? img2Info.fileName : 'NOT FOUND');

    // ── 3. Tạo prompt từ thông tin DB ───────────────────────────────────────
    const prompt = buildPrompt(p1, p2);
    console.log('[AI] Prompt:', prompt.substring(0, 150) + '...');

    // ── 4. Gọi Pollinations AI — thử flux-pro trước, fallback flux ──────────
    const seed = Math.floor(Math.random() * 999999);
    let buffer;

    try {
      buffer = await callPollinations(prompt, 'flux-pro', 1280, 640, seed);
      console.log('[AI] flux-pro success, size:', Math.round(buffer.length / 1024), 'KB');
    } catch (e1) {
      console.warn('[AI] flux-pro failed:', e1.message, '— retrying with flux...');
      try {
        buffer = await callPollinations(prompt, 'flux', 1280, 640, seed);
        console.log('[AI] flux success, size:', Math.round(buffer.length / 1024), 'KB');
      } catch (e2) {
        console.warn('[AI] flux failed:', e2.message, '— retrying with turbo...');
        buffer = await callPollinations(prompt, 'turbo', 1280, 640, seed);
        console.log('[AI] turbo success, size:', Math.round(buffer.length / 1024), 'KB');
      }
    }
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    console.log('[AI] Done, size:', Math.round(buffer.length / 1024), 'KB');

    // ── 5. Trả về kết quả ──────────────────────────────────────────────────
    return res.json({
      success: true,
      imageUrl: dataUrl,
      products: {
        product1: {
          id: p1.MaSanPham,
          name: p1.TenSanPham,
          transparentImage: img1Info ? `/images_nen/${img1Info.fileName}` : null,
        },
        product2: {
          id: p2.MaSanPham,
          name: p2.TenSanPham,
          transparentImage: img2Info ? `/images_nen/${img2Info.fileName}` : null,
        },
      },
    });

  } catch (error) {
    console.error('[AI] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Lỗi tạo ảnh: ${error.message}`,
    });
  }
};
