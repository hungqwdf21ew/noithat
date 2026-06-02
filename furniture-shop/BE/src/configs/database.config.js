const sql = require('mssql');

// Đọc config lazily (trong hàm connect) để đảm bảo dotenv đã load xong
const getConfig = () => ({
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server:   process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  port:     Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
});

let pool = null;

const connect = async () => {
  if (pool) return pool;

  try {
    pool = await sql.connect(getConfig());
    console.log('✅ Connected to SQL Server');

    // Run setup query to align DB styles/materials with the premium frontend filters
    try {
      await pool.request().query(`
        -- 1. Cập nhật tên phong cách trong dbo.PhongCach
        UPDATE dbo.PhongCach SET TenPhongCach = N'Cổ điển châu Âu' WHERE MaPhongCach = 2;
        UPDATE dbo.PhongCach SET TenPhongCach = N'Tân cổ điển' WHERE MaPhongCach = 3;
        UPDATE dbo.PhongCach SET TenPhongCach = N'Hoàng gia' WHERE MaPhongCach = 4;
        UPDATE dbo.PhongCach SET TenPhongCach = N'Luxury Classic' WHERE MaPhongCach = 5;

        -- 2. Cập nhật chất liệu và phong cách cho các sản phẩm mẫu để khớp bộ lọc
        UPDATE dbo.SanPham SET ChatLieu = N'Vải cao cấp, gỗ tự nhiên', MaPhongCach = 2 WHERE MaSKU = 'SF001';
        UPDATE dbo.SanPham SET ChatLieu = N'Da thật, gỗ tự nhiên', MaPhongCach = 3 WHERE MaSKU = 'SF002';
        UPDATE dbo.SanPham SET ChatLieu = N'Gỗ tự nhiên', MaPhongCach = 5 WHERE MaSKU = 'BT001';
        UPDATE dbo.SanPham SET ChatLieu = N'Gỗ tự nhiên', MaPhongCach = 5 WHERE MaSKU = 'BA001';
        UPDATE dbo.SanPham SET ChatLieu = N'Vải cao cấp', MaPhongCach = 3 WHERE MaSKU = 'GH001';
        UPDATE dbo.SanPham SET ChatLieu = N'Gỗ tự nhiên', MaPhongCach = 4 WHERE MaSKU = 'GN001';
        UPDATE dbo.SanPham SET ChatLieu = N'Gỗ tự nhiên', MaPhongCach = 2 WHERE MaSKU = 'TU001';
        UPDATE dbo.SanPham SET ChatLieu = N'Đồng mạ vàng, pha lê', MaPhongCach = 3 WHERE MaSKU = 'DE001';
      `);
      console.log('⚡ Database filters successfully synchronized with Frontend filters');
    } catch (dbErr) {
      console.warn('⚠️ Warning: Non-critical DB setup error (might be running in offline mode):', dbErr.message);
    }

    return pool;
  } catch (error) {
    console.error('❌ SQL Server connection error:', error.message || error);
    throw error;
  }
};

module.exports = { sql, connect };

