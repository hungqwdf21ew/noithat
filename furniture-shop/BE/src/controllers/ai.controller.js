const https = require('https');

/**
 * Tải ảnh từ URL về buffer base64 (follow redirect)
 */
function downloadImage(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));

    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 60000,
    };

    const chunks = [];
    const req = https.request(options, (res) => {
      // Follow redirect
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
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

/**
 * POST /api/ai/bundle-image
 * Body: { product1: { name, category }, product2: { name, category } }
 * Dùng Pollinations.ai — miễn phí, không cần key
 */
exports.generateBundleImage = async (req, res) => {
  try {
    const { product1, product2 } = req.body;
    if (!product1 || !product2) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin sản phẩm.' });
    }

    // Prompt phong cách minimalist luxury như ảnh mẫu
    const prompt = [
      `minimalist luxury living room interior design`,
      `${product1.name} placed on the left`,
      `${product2.name} placed on the right`,
      `natural sunlight through sheer white curtains`,
      `cream beige tones travertine floor arched doorway`,
      `olive tree visible through window soft shadows`,
      `professional interior photography 4K photorealistic`,
      `high-end furniture showroom warm light`,
    ].join(', ');

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=640&nologo=true&enhance=true&seed=${Date.now()}`;

    console.log('[AI] Pollinations request:', product1.name, '+', product2.name);

    const buffer = await downloadImage(imageUrl);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    console.log('[AI] Image generated, size:', buffer.length, 'bytes');
    return res.json({ success: true, imageUrl: dataUrl });

  } catch (error) {
    console.error('[AI] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Lỗi tạo ảnh: ${error.message}`,
    });
  }
};
