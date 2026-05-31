const { sql, connect } = require('../configs/database.config');

const CollectionModel = {
  findAll: async () => {
    const pool = await connect();
    const result = await pool.request().query(`
      SELECT MaBoSuuTap, TenBoSuuTap, DuongDan, MoTa, HinhAnh, TrangThai
      FROM dbo.BoSuuTap
      ORDER BY NgayTao DESC
    `);
    return result.recordset;
  },

  findById: async (id) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaBoSuuTap', sql.Int, id)
      .query(`
        SELECT MaBoSuuTap, TenBoSuuTap, DuongDan, MoTa, HinhAnh, TrangThai
        FROM dbo.BoSuuTap
        WHERE MaBoSuuTap = @MaBoSuuTap
      `);
    return result.recordset[0] || null;
  },

  create: async (data) => {
    const pool = await connect();
    const result = await pool.request()
      .input('TenBoSuuTap', sql.NVarChar(150), data.tenBoSuuTap)
      .input('DuongDan', sql.NVarChar(150), data.duongDan)
      .input('MoTa', sql.NVarChar(1000), data.moTa || null)
      .input('HinhAnh', sql.NVarChar(500), data.hinhAnh || null)
      .input('TrangThai', sql.NVarChar(20), data.trangThai || 'HOAT_DONG')
      .query(`
        INSERT INTO dbo.BoSuuTap (TenBoSuuTap, DuongDan, MoTa, HinhAnh, TrangThai)
        OUTPUT INSERTED.MaBoSuuTap, INSERTED.TenBoSuuTap, INSERTED.DuongDan, INSERTED.MoTa, INSERTED.HinhAnh
        VALUES (@TenBoSuuTap, @DuongDan, @MoTa, @HinhAnh, @TrangThai)
      `);
    return result.recordset[0];
  },

  update: async (id, data) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaBoSuuTap', sql.Int, id)
      .input('TenBoSuuTap', sql.NVarChar(150), data.tenBoSuuTap)
      .input('DuongDan', sql.NVarChar(150), data.duongDan)
      .input('MoTa', sql.NVarChar(1000), data.moTa || null)
      .input('HinhAnh', sql.NVarChar(500), data.hinhAnh || null)
      .input('TrangThai', sql.NVarChar(20), data.trangThai || 'HOAT_DONG')
      .query(`
        UPDATE dbo.BoSuuTap
        SET TenBoSuuTap = @TenBoSuuTap,
            DuongDan = @DuongDan,
            MoTa = @MoTa,
            HinhAnh = @HinhAnh,
            TrangThai = @TrangThai
        OUTPUT INSERTED.MaBoSuuTap, INSERTED.TenBoSuuTap, INSERTED.DuongDan, INSERTED.MoTa, INSERTED.HinhAnh
        WHERE MaBoSuuTap = @MaBoSuuTap
      `);
    return result.recordset[0] || null;
  },

  delete: async (id) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaBoSuuTap', sql.Int, id)
      .query(`
        DELETE FROM dbo.BoSuuTap
        WHERE MaBoSuuTap = @MaBoSuuTap
      `);
    return result.rowsAffected[0] > 0;
  }
};

module.exports = CollectionModel;
