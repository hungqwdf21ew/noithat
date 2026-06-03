IF DB_ID(N'QLNT') IS NULL BEGIN CREATE DATABASE QLNT; END
GO
USE QLNT;
GO
IF OBJECT_ID(N'dbo.ChiTietBoSanPham','U') IS NOT NULL DROP TABLE dbo.ChiTietBoSanPham;
IF OBJECT_ID(N'dbo.BoSanPham','U') IS NOT NULL DROP TABLE dbo.BoSanPham;
IF OBJECT_ID(N'dbo.ChiTietPhoiPhong','U') IS NOT NULL DROP TABLE dbo.ChiTietPhoiPhong;
IF OBJECT_ID(N'dbo.DuAnPhoiPhong','U') IS NOT NULL DROP TABLE dbo.DuAnPhoiPhong;
IF OBJECT_ID(N'dbo.ChiTietSoSanh','U') IS NOT NULL DROP TABLE dbo.ChiTietSoSanh;
IF OBJECT_ID(N'dbo.SoSanhSanPham','U') IS NOT NULL DROP TABLE dbo.SoSanhSanPham;
IF OBJECT_ID(N'dbo.TinNhanLienHe','U') IS NOT NULL DROP TABLE dbo.TinNhanLienHe;
IF OBJECT_ID(N'dbo.LichHenShowroom','U') IS NOT NULL DROP TABLE dbo.LichHenShowroom;
IF OBJECT_ID(N'dbo.BannerQuangCao','U') IS NOT NULL DROP TABLE dbo.BannerQuangCao;
IF OBJECT_ID(N'dbo.ChiTietBoSuuTap','U') IS NOT NULL DROP TABLE dbo.ChiTietBoSuuTap;
IF OBJECT_ID(N'dbo.BoSuuTap','U') IS NOT NULL DROP TABLE dbo.BoSuuTap;
IF OBJECT_ID(N'dbo.ThanhToan','U') IS NOT NULL DROP TABLE dbo.ThanhToan;
IF OBJECT_ID(N'dbo.ChiTietDonHang','U') IS NOT NULL DROP TABLE dbo.ChiTietDonHang;
IF OBJECT_ID(N'dbo.DonHang','U') IS NOT NULL DROP TABLE dbo.DonHang;
IF OBJECT_ID(N'dbo.MaGiamGia','U') IS NOT NULL DROP TABLE dbo.MaGiamGia;
IF OBJECT_ID(N'dbo.ChiTietGioHang','U') IS NOT NULL DROP TABLE dbo.ChiTietGioHang;
IF OBJECT_ID(N'dbo.GioHang','U') IS NOT NULL DROP TABLE dbo.GioHang;
IF OBJECT_ID(N'dbo.DanhGiaSanPham','U') IS NOT NULL DROP TABLE dbo.DanhGiaSanPham;
IF OBJECT_ID(N'dbo.SanPhamYeuThich','U') IS NOT NULL DROP TABLE dbo.SanPhamYeuThich;
IF OBJECT_ID(N'dbo.HinhAnhSanPham','U') IS NOT NULL DROP TABLE dbo.HinhAnhSanPham;
IF OBJECT_ID(N'dbo.SanPham','U') IS NOT NULL DROP TABLE dbo.SanPham;
IF OBJECT_ID(N'dbo.Phong','U') IS NOT NULL DROP TABLE dbo.Phong;
IF OBJECT_ID(N'dbo.PhongCach','U') IS NOT NULL DROP TABLE dbo.PhongCach;
IF OBJECT_ID(N'dbo.DanhMuc','U') IS NOT NULL DROP TABLE dbo.DanhMuc;
IF OBJECT_ID(N'dbo.DiaChiNguoiDung','U') IS NOT NULL DROP TABLE dbo.DiaChiNguoiDung;
IF OBJECT_ID(N'dbo.NguoiDung','U') IS NOT NULL DROP TABLE dbo.NguoiDung;
GO
CREATE TABLE dbo.NguoiDung (
    MaNguoiDung INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    MatKhauHash NVARCHAR(255) NOT NULL,
    SoDienThoai NVARCHAR(20) NULL,
    AnhDaiDien NVARCHAR(500) NULL,
    VaiTro NVARCHAR(20) NOT NULL DEFAULT N'KHACH_HANG',
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,
    CONSTRAINT CK_NguoiDung_VaiTro CHECK (VaiTro IN (N'ADMIN',N'NHAN_VIEN',N'KHACH_HANG')),
    CONSTRAINT CK_NguoiDung_TrangThai CHECK (TrangThai IN (N'HOAT_DONG',N'KHOA',N'VO_HIEU'))
);
GO
CREATE TABLE dbo.DiaChiNguoiDung (
    MaDiaChi INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    TenNguoiNhan NVARCHAR(100) NOT NULL,
    SoDienThoai NVARCHAR(20) NOT NULL,
    DiaChiChiTiet NVARCHAR(255) NOT NULL,
    PhuongXa NVARCHAR(100) NULL,
    QuanHuyen NVARCHAR(100) NULL,
    TinhThanh NVARCHAR(100) NULL,
    LaMacDinh BIT NOT NULL DEFAULT 0,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_DiaChi_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung) ON DELETE CASCADE
);
GO
CREATE TABLE dbo.DanhMuc (
    MaDanhMuc INT IDENTITY(1,1) PRIMARY KEY,
    MaDanhMucCha INT NULL,
    TenDanhMuc NVARCHAR(100) NOT NULL,
    DuongDan NVARCHAR(150) NOT NULL UNIQUE,
    MoTa NVARCHAR(500) NULL,
    HinhAnh NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_DanhMuc_Cha FOREIGN KEY (MaDanhMucCha) REFERENCES dbo.DanhMuc(MaDanhMuc),
    CONSTRAINT CK_DanhMuc_TrangThai CHECK (TrangThai IN (N'HOAT_DONG',N'AN'))
);
GO
CREATE TABLE dbo.PhongCach (
    MaPhongCach INT IDENTITY(1,1) PRIMARY KEY,
    TenPhongCach NVARCHAR(100) NOT NULL,
    DuongDan NVARCHAR(150) NOT NULL UNIQUE,
    MoTa NVARCHAR(500) NULL,
    HinhAnh NVARCHAR(500) NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO
CREATE TABLE dbo.Phong (
    MaPhong INT IDENTITY(1,1) PRIMARY KEY,
    TenPhong NVARCHAR(100) NOT NULL,
    DuongDan NVARCHAR(150) NOT NULL UNIQUE,
    MoTa NVARCHAR(500) NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO
CREATE TABLE dbo.SanPham (
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
    MaDanhMuc INT NOT NULL,
    MaPhongCach INT NULL,
    MaPhong INT NULL,
    TenSanPham NVARCHAR(255) NOT NULL,
    DuongDan NVARCHAR(255) NOT NULL UNIQUE,
    MaSKU NVARCHAR(50) NULL UNIQUE,
    MoTa NVARCHAR(MAX) NULL,
    GiaBan DECIMAL(18,2) NOT NULL,
    GiaKhuyenMai DECIMAL(18,2) NULL,
    SoLuongTon INT NOT NULL DEFAULT 0,
    ChatLieu NVARCHAR(100) NULL,
    MauSac NVARCHAR(100) NULL,
    KichThuoc NVARCHAR(100) NULL,
    KhoiLuong DECIMAL(10,2) NULL,
    HinhAnhChinh NVARCHAR(500) NULL,
    LaNoiBat BIT NOT NULL DEFAULT 0,
    TrangThai NVARCHAR(30) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,
    CONSTRAINT FK_SanPham_DanhMuc FOREIGN KEY (MaDanhMuc) REFERENCES dbo.DanhMuc(MaDanhMuc),
    CONSTRAINT FK_SanPham_PhongCach FOREIGN KEY (MaPhongCach) REFERENCES dbo.PhongCach(MaPhongCach),
    CONSTRAINT FK_SanPham_Phong FOREIGN KEY (MaPhong) REFERENCES dbo.Phong(MaPhong),
    CONSTRAINT CK_SanPham_GiaBan CHECK (GiaBan >= 0),
    CONSTRAINT CK_SanPham_SoLuong CHECK (SoLuongTon >= 0),
    CONSTRAINT CK_SanPham_TrangThai CHECK (TrangThai IN (N'HOAT_DONG',N'AN',N'HET_HANG'))
);
GO
CREATE TABLE dbo.HinhAnhSanPham (
    MaHinhAnh INT IDENTITY(1,1) PRIMARY KEY,
    MaSanPham INT NOT NULL,
    DuongDanHinh NVARCHAR(500) NOT NULL,
    MoTaHinh NVARCHAR(255) NULL,
    ThuTuHienThi INT NOT NULL DEFAULT 0,
    LaAnhDaiDien BIT NOT NULL DEFAULT 0,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_HinhAnh_SanPham FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham) ON DELETE CASCADE
);
GO
CREATE TABLE dbo.SanPhamYeuThich (
    MaYeuThich INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    MaSanPham INT NOT NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_YeuThich_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    CONSTRAINT FK_YeuThich_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham) ON DELETE CASCADE,
    CONSTRAINT UQ_YeuThich UNIQUE (MaNguoiDung,MaSanPham)
);
GO
CREATE TABLE dbo.DanhGiaSanPham (
    MaDanhGia INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoSao INT NOT NULL,
    NoiDung NVARCHAR(1000) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'CHO_DUYET',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,
    CONSTRAINT FK_DanhGia_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung),
    CONSTRAINT FK_DanhGia_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham) ON DELETE CASCADE,
    CONSTRAINT CK_DanhGia_SoSao CHECK (SoSao BETWEEN 1 AND 5),
    CONSTRAINT CK_DanhGia_TrangThai CHECK (TrangThai IN (N'CHO_DUYET',N'DA_DUYET',N'TU_CHOI')),
    CONSTRAINT UQ_DanhGia UNIQUE (MaNguoiDung,MaSanPham)
);
GO
CREATE TABLE dbo.GioHang (
    MaGioHang INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL UNIQUE,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,
    CONSTRAINT FK_GioHang_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung) ON DELETE CASCADE
);
GO
CREATE TABLE dbo.ChiTietGioHang (
    MaChiTietGioHang INT IDENTITY(1,1) PRIMARY KEY,
    MaGioHang INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,
    CONSTRAINT FK_CTGH_GH FOREIGN KEY (MaGioHang) REFERENCES dbo.GioHang(MaGioHang) ON DELETE CASCADE,
    CONSTRAINT FK_CTGH_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),
    CONSTRAINT CK_CTGH_SoLuong CHECK (SoLuong > 0),
    CONSTRAINT UQ_CTGH UNIQUE (MaGioHang,MaSanPham)
);
GO
CREATE TABLE dbo.MaGiamGia (
    MaGiamGia INT IDENTITY(1,1) PRIMARY KEY,
    MaCode NVARCHAR(50) NOT NULL UNIQUE,
    TenMa NVARCHAR(150) NULL,
    KieuGiam NVARCHAR(20) NOT NULL,
    GiaTriGiam DECIMAL(18,2) NOT NULL,
    DonToiThieu DECIMAL(18,2) NOT NULL DEFAULT 0,
    GiamToiDa DECIMAL(18,2) NULL,
    NgayBatDau DATETIME2 NULL,
    NgayKetThuc DATETIME2 NULL,
    GioiHanSuDung INT NULL,
    SoLanDaDung INT NOT NULL DEFAULT 0,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_MGG_KieuGiam CHECK (KieuGiam IN (N'PHAN_TRAM',N'TIEN_MAT')),
    CONSTRAINT CK_MGG_TrangThai CHECK (TrangThai IN (N'HOAT_DONG',N'AN',N'HET_HAN'))
);
GO
CREATE TABLE dbo.DonHang (
    MaDonHang INT IDENTITY(1,1) PRIMARY KEY,
    MaDonHangCode NVARCHAR(30) NOT NULL UNIQUE,
    MaNguoiDung INT NULL,
    MaGiamGia INT NULL,
    TenKhachHang NVARCHAR(100) NOT NULL,
    SoDienThoai NVARCHAR(20) NOT NULL,
    DiaChiGiaoHang NVARCHAR(255) NOT NULL,
    GhiChu NVARCHAR(500) NULL,
    TamTinh DECIMAL(18,2) NOT NULL DEFAULT 0,
    TienGiam DECIMAL(18,2) NOT NULL DEFAULT 0,
    PhiVanChuyen DECIMAL(18,2) NOT NULL DEFAULT 0,
    TongTien DECIMAL(18,2) NOT NULL DEFAULT 0,
    TrangThaiDonHang NVARCHAR(30) NOT NULL DEFAULT N'CHO_XAC_NHAN',
    PhuongThucThanhToan NVARCHAR(30) NOT NULL DEFAULT N'THANH_TOAN_KHI_NHAN_HANG',
    TrangThaiThanhToan NVARCHAR(30) NOT NULL DEFAULT N'CHUA_THANH_TOAN',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,
    CONSTRAINT FK_DonHang_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung),
    CONSTRAINT FK_DonHang_MGG FOREIGN KEY (MaGiamGia) REFERENCES dbo.MaGiamGia(MaGiamGia),
    CONSTRAINT CK_DH_TrangThai CHECK (TrangThaiDonHang IN (N'CHO_XAC_NHAN',N'DA_XAC_NHAN',N'DANG_GIAO',N'HOAN_THANH',N'DA_HUY')),
    CONSTRAINT CK_DH_PTTT CHECK (PhuongThucThanhToan IN (N'THANH_TOAN_KHI_NHAN_HANG',N'CHUYEN_KHOAN',N'MOMO',N'VNPAY')),
    CONSTRAINT CK_DH_TTTT CHECK (TrangThaiThanhToan IN (N'CHUA_THANH_TOAN',N'DA_THANH_TOAN',N'THANH_TOAN_LOI',N'HOAN_TIEN'))
);
GO
CREATE TABLE dbo.ChiTietDonHang (
    MaChiTietDonHang INT IDENTITY(1,1) PRIMARY KEY,
    MaDonHang INT NOT NULL,
    MaSanPham INT NOT NULL,
    TenSanPham NVARCHAR(255) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    SoLuong INT NOT NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_CTDH_DH FOREIGN KEY (MaDonHang) REFERENCES dbo.DonHang(MaDonHang) ON DELETE CASCADE,
    CONSTRAINT FK_CTDH_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),
    CONSTRAINT CK_CTDH_DonGia CHECK (DonGia >= 0),
    CONSTRAINT CK_CTDH_SoLuong CHECK (SoLuong > 0)
);
GO
CREATE TABLE dbo.ThanhToan (
    MaThanhToan INT IDENTITY(1,1) PRIMARY KEY,
    MaDonHang INT NOT NULL,
    SoTien DECIMAL(18,2) NOT NULL,
    PhuongThuc NVARCHAR(30) NOT NULL,
    TrangThai NVARCHAR(30) NOT NULL DEFAULT N'DANG_CHO',
    MaGiaoDich NVARCHAR(100) NULL,
    NgayThanhToan DATETIME2 NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_TT_DH FOREIGN KEY (MaDonHang) REFERENCES dbo.DonHang(MaDonHang) ON DELETE CASCADE,
    CONSTRAINT CK_TT_PT CHECK (PhuongThuc IN (N'THANH_TOAN_KHI_NHAN_HANG',N'CHUYEN_KHOAN',N'MOMO',N'VNPAY')),
    CONSTRAINT CK_TT_TrangThai CHECK (TrangThai IN (N'DANG_CHO',N'THANH_CONG',N'THAT_BAI',N'HOAN_TIEN'))
);
GO
CREATE TABLE dbo.BoSuuTap (
    MaBoSuuTap INT IDENTITY(1,1) PRIMARY KEY,
    TenBoSuuTap NVARCHAR(150) NOT NULL,
    DuongDan NVARCHAR(150) NOT NULL UNIQUE,
    MoTa NVARCHAR(1000) NULL,
    HinhAnh NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_BST_TrangThai CHECK (TrangThai IN (N'HOAT_DONG',N'AN'))
);
GO
CREATE TABLE dbo.ChiTietBoSuuTap (
    MaBoSuuTap INT NOT NULL,
    MaSanPham INT NOT NULL,
    ThuTuHienThi INT NOT NULL DEFAULT 0,
    CONSTRAINT PK_CTBST PRIMARY KEY (MaBoSuuTap,MaSanPham),
    CONSTRAINT FK_CTBST_BST FOREIGN KEY (MaBoSuuTap) REFERENCES dbo.BoSuuTap(MaBoSuuTap) ON DELETE CASCADE,
    CONSTRAINT FK_CTBST_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham) ON DELETE CASCADE
);
GO
CREATE TABLE dbo.BannerQuangCao (
    MaBanner INT IDENTITY(1,1) PRIMARY KEY,
    TieuDe NVARCHAR(150) NOT NULL,
    TieuDePhu NVARCHAR(255) NULL,
    HinhAnh NVARCHAR(500) NOT NULL,
    DuongDanLienKet NVARCHAR(500) NULL,
    ViTri NVARCHAR(50) NOT NULL DEFAULT N'TRANG_CHU_TREN',
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayBatDau DATETIME2 NULL,
    NgayKetThuc DATETIME2 NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_Banner_TrangThai CHECK (TrangThai IN (N'HOAT_DONG',N'AN'))
);
GO
CREATE TABLE dbo.LichHenShowroom (
    MaLichHen INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    SoDienThoai NVARCHAR(20) NOT NULL,
    Email NVARCHAR(150) NULL,
    NgayHen DATE NOT NULL,
    GioHen TIME NOT NULL,
    GhiChu NVARCHAR(500) NULL,
    TrangThai NVARCHAR(30) NOT NULL DEFAULT N'CHO_XAC_NHAN',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_LichHen_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung),
    CONSTRAINT CK_LichHen_TrangThai CHECK (TrangThai IN (N'CHO_XAC_NHAN',N'DA_XAC_NHAN',N'DA_HUY',N'HOAN_THANH'))
);
GO
CREATE TABLE dbo.TinNhanLienHe (
    MaTinNhan INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    SoDienThoai NVARCHAR(20) NULL,
    Email NVARCHAR(150) NULL,
    TieuDe NVARCHAR(200) NULL,
    NoiDung NVARCHAR(MAX) NOT NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'MOI',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_TinNhan_TrangThai CHECK (TrangThai IN (N'MOI',N'DA_DOC',N'DA_TRA_LOI'))
);
GO
CREATE TABLE dbo.SoSanhSanPham (
    MaSoSanh INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NULL,
    MaPhien NVARCHAR(100) NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_SoSanh_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung) ON DELETE CASCADE
);
GO
CREATE TABLE dbo.ChiTietSoSanh (
    MaChiTietSoSanh INT IDENTITY(1,1) PRIMARY KEY,
    MaSoSanh INT NOT NULL,
    MaSanPham INT NOT NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_CTSS_SS FOREIGN KEY (MaSoSanh) REFERENCES dbo.SoSanhSanPham(MaSoSanh) ON DELETE CASCADE,
    CONSTRAINT FK_CTSS_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham) ON DELETE CASCADE,
    CONSTRAINT UQ_CTSS UNIQUE (MaSoSanh,MaSanPham)
);
GO
CREATE TABLE dbo.DuAnPhoiPhong (
    MaDuAnPhoiPhong INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    MaPhong INT NULL,
    MaPhongCach INT NULL,
    TenDuAn NVARCHAR(150) NOT NULL,
    HinhAnhKhongGian NVARCHAR(500) NULL,
    ChieuRong DECIMAL(10,2) NULL,
    ChieuDai DECIMAL(10,2) NULL,
    ChieuCao DECIMAL(10,2) NULL,
    GhiChu NVARCHAR(1000) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'NHAP',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,
    CONSTRAINT FK_DAPP_ND FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    CONSTRAINT FK_DAPP_Phong FOREIGN KEY (MaPhong) REFERENCES dbo.Phong(MaPhong),
    CONSTRAINT FK_DAPP_PC FOREIGN KEY (MaPhongCach) REFERENCES dbo.PhongCach(MaPhongCach),
    CONSTRAINT CK_DAPP_TrangThai CHECK (TrangThai IN (N'NHAP',N'DA_LUU',N'LUU_TRU'))
);
GO
CREATE TABLE dbo.ChiTietPhoiPhong (
    MaChiTietPhoiPhong INT IDENTITY(1,1) PRIMARY KEY,
    MaDuAnPhoiPhong INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    ViTriX DECIMAL(10,2) NULL,
    ViTriY DECIMAL(10,2) NULL,
    TiLe DECIMAL(10,2) NULL,
    GocXoay DECIMAL(10,2) NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_CTPP_DAPP FOREIGN KEY (MaDuAnPhoiPhong) REFERENCES dbo.DuAnPhoiPhong(MaDuAnPhoiPhong) ON DELETE CASCADE,
    CONSTRAINT FK_CTPP_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),
    CONSTRAINT CK_CTPP_SL CHECK (SoLuong > 0)
);
GO
CREATE TABLE dbo.BoSanPham (
    MaBoSanPham INT IDENTITY(1,1) PRIMARY KEY,
    MaSanPhamChinh INT NOT NULL,
    TenBoSanPham NVARCHAR(150) NOT NULL,
    MoTa NVARCHAR(1000) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_BSP_SP FOREIGN KEY (MaSanPhamChinh) REFERENCES dbo.SanPham(MaSanPham),
    CONSTRAINT CK_BSP_TrangThai CHECK (TrangThai IN (N'HOAT_DONG',N'AN'))
);
GO
CREATE TABLE dbo.ChiTietBoSanPham (
    MaChiTietBoSanPham INT IDENTITY(1,1) PRIMARY KEY,
    MaBoSanPham INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    CONSTRAINT FK_CTBSP_BSP FOREIGN KEY (MaBoSanPham) REFERENCES dbo.BoSanPham(MaBoSanPham) ON DELETE CASCADE,
    CONSTRAINT FK_CTBSP_SP FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),
    CONSTRAINT CK_CTBSP_SL CHECK (SoLuong > 0),
    CONSTRAINT UQ_CTBSP UNIQUE (MaBoSanPham,MaSanPham)
);
GO
CREATE INDEX IX_SP_DanhMuc   ON dbo.SanPham(MaDanhMuc);
CREATE INDEX IX_SP_PhongCach ON dbo.SanPham(MaPhongCach);
CREATE INDEX IX_SP_Phong     ON dbo.SanPham(MaPhong);
CREATE INDEX IX_SP_Ten       ON dbo.SanPham(TenSanPham);
CREATE INDEX IX_SP_Gia       ON dbo.SanPham(GiaBan);
CREATE INDEX IX_DH_ND        ON dbo.DonHang(MaNguoiDung);
CREATE INDEX IX_DH_TrangThai ON dbo.DonHang(TrangThaiDonHang);
CREATE INDEX IX_DG_SP        ON dbo.DanhGiaSanPham(MaSanPham);
CREATE INDEX IX_YT_ND        ON dbo.SanPhamYeuThich(MaNguoiDung);
GO
INSERT INTO dbo.NguoiDung (HoTen,Email,MatKhauHash,SoDienThoai,VaiTro,TrangThai) VALUES
(N'Quan tri vien',      N'admin@noithat.com',    N'admin123',     N'0900000001', N'ADMIN',      N'HOAT_DONG'),
(N'Nhan vien ban hang', N'nhanvien@noithat.com', N'nhanvien123',  N'0900000002', N'NHAN_VIEN',  N'HOAT_DONG'),
(N'Nguyen Van Khach',   N'khachhang@gmail.com',  N'khachhang123', N'0900000003', N'KHACH_HANG', N'HOAT_DONG'),
(N'Tran Minh Quan',     N'quan@gmail.com',        N'quan123',      N'0901111111', N'KHACH_HANG', N'HOAT_DONG'),
(N'Le Thi Hong',        N'hong@gmail.com',         N'hong123',      N'0902222222', N'KHACH_HANG', N'HOAT_DONG'),
(N'Pham Gia Bao',       N'bao@gmail.com',           N'bao123',       N'0903333333', N'KHACH_HANG', N'HOAT_DONG'),
(N'Nguyen Ngoc Anh',    N'anh@gmail.com',           N'anh123',       N'0904444444', N'KHACH_HANG', N'HOAT_DONG'),
(N'Hoang Van Nam',      N'nam@gmail.com',            N'nam123',       N'0905555555', N'NHAN_VIEN',  N'HOAT_DONG'),
(N'Dang Thanh Tu',      N'tu@gmail.com',             N'tu123',        N'0906666666', N'ADMIN',      N'HOAT_DONG');
GO
INSERT INTO dbo.DiaChiNguoiDung (MaNguoiDung,TenNguoiNhan,SoDienThoai,DiaChiChiTiet,PhuongXa,QuanHuyen,TinhThanh,LaMacDinh) VALUES
(1,N'Quan tri vien',      N'0900000001',N'01 Nguyen Van Linh',   N'Hai Chau 1',    N'Hai Chau', N'Da Nang',1),
(2,N'Nhan vien ban hang', N'0900000002',N'15 Le Duan',            N'Thach Thang',   N'Hai Chau', N'Da Nang',1),
(3,N'Nguyen Van Khach',   N'0900000003',N'22 Dien Bien Phu',      N'Chinh Gian',    N'Thanh Khe',N'Da Nang',1),
(4,N'Tran Minh Quan',     N'0901111111',N'45 Nguyen Huu Tho',     N'Hoa Thuan Tay', N'Hai Chau', N'Da Nang',1),
(5,N'Le Thi Hong',        N'0902222222',N'72 Tran Cao Van',       N'Tam Thuan',     N'Thanh Khe',N'Da Nang',1),
(6,N'Pham Gia Bao',       N'0903333333',N'18 Ngo Quyen',          N'An Hai Bac',    N'Son Tra',  N'Da Nang',1);
GO
INSERT INTO dbo.DanhMuc (TenDanhMuc,DuongDan,MoTa,HinhAnh) VALUES
(N'Sofa',         N'sofa',          N'Cac mau sofa phong khach hien dai',    N'/uploads/categories/sofa.jpg'),
(N'Ban',          N'ban',           N'Ban tra, ban an, ban lam viec',        N'/uploads/categories/ban.jpg'),
(N'Ghe',          N'ghe',           N'Ghe an, ghe lam viec, ghe thu gian',   N'/uploads/categories/ghe.jpg'),
(N'Giuong',       N'giuong',        N'Giuong ngu nhieu phong cach',          N'/uploads/categories/giuong.jpg'),
(N'Tu',           N'tu',            N'Tu quan ao, tu trang tri, tu bep',     N'/uploads/categories/tu.jpg'),
(N'Den trang tri',N'den-trang-tri', N'Den ban, den san, den treo',           N'/uploads/categories/den.jpg'),
(N'Trang tri nha',N'trang-tri-nha', N'Guong, tranh va cac phu kien',        N'/images/categories/trang-tri-nha.png');
GO
INSERT INTO dbo.PhongCach (TenPhongCach,DuongDan,MoTa,HinhAnh) VALUES
(N'Toi gian',         N'toi-gian',        N'Phong cach don gian, tinh gon',              N'/images/phongcach/toi-gian.png'),
(N'Co dien chau Au',  N'co-dien-chau-au', N'Phong cach quy toc chau Au, sang trong',    N'/images/phongcach/co-dien-chau-au.png'),
(N'Tan co dien',      N'tan-co-dien',     N'Ket hop co dien va hien dai',                N'/images/phongcach/tan-co-dien.png'),
(N'Hoang gia',        N'hoang-gia',       N'Phong cach xa hoa, dat vang, quyen quy',     N'/images/phongcach/hoang-gia.png'),
(N'Luxury Classic',   N'luxury-classic',  N'Co dien cao cap, tinh te, sang trong',       N'/images/phongcach/luxury-classic.png'),
(N'Industrial',       N'industrial',      N'Phong cach cong nghiep, kim loai, be tong',  N'/images/phongcach/industrial.png'),
(N'Vintage',          N'vintage',         N'Phong cach hoai co, dau an thoi gian',       N'/images/phongcach/vintage.png'),
(N'Japandi',          N'japandi',         N'Ket hop Nhat Ban toi gian va Bac Au am cung',N'/images/phongcach/japandi.png'),
(N'Tropical',         N'tropical',        N'Cam hung thien nhien nhiet doi tuoi mat',    N'/images/phongcach/tropical.png'),
(N'Luxury Modern',    N'luxury-modern',   N'Hien dai cao cap, vat lieu sang trong',      N'/images/phongcach/luxury-modern.png'),
(N'Rustic',           N'rustic',          N'Moc mac, gan gui thien nhien',               N'/images/phongcach/rustic.png');
GO
INSERT INTO dbo.Phong (TenPhong,DuongDan,MoTa) VALUES
(N'Phong khach',    N'phong-khach',   N'Khong gian tiep khach va sinh hoat chung'),
(N'Phong ngu',      N'phong-ngu',     N'Khong gian nghi ngoi'),
(N'Phong bep',      N'phong-bep',     N'Khong gian an uong va nau nuong'),
(N'Phong lam viec', N'phong-lam-viec',N'Khong gian hoc tap, lam viec'),
(N'Ban cong',       N'ban-cong',      N'Khong gian thu gian ngoai troi');
GO
INSERT INTO dbo.SanPham (MaDanhMuc,MaPhongCach,MaPhong,TenSanPham,DuongDan,MaSKU,MoTa,GiaBan,GiaKhuyenMai,SoLuongTon,ChatLieu,MauSac,KichThuoc,KhoiLuong,HinhAnhChinh,LaNoiBat,TrangThai) VALUES
(1,4,1,N'Sofa Heritage Royale',        N'sofa-heritage-royale',      N'SP-HR001', N'Sang trong - Tinh te - Quyen quy',                78500000, NULL,    20,N'Go tu nhien boc nhung cao cap',         N'Do do',         N'280x95x120 cm', 85,  N'/images/sofa-heritage-royale.png',          1,N'HOAT_DONG'),
(3,4,1,N'Ghe Banh Louis XV',           N'ghe-banh-louis-xv',         N'SP-LX001', N'Ve dep nang gia tri vuot thoi gian',               24800000, NULL,    15,N'Go cham khac thu cong',                 N'Do do',         N'95x90x140 cm',  35,  N'/images/ghe-louis-xv.png',                  1,N'HOAT_DONG'),
(2,4,3,N'Ban An Grand Palace',         N'ban-an-grand-palace',        N'SP-GP001', N'Kiet tac danh cho khong gian dang cap',            125000000,NULL,    8, N'Go tu nhien dat vang',                  N'Nau vang',      N'320x120x80 cm', 120, N'/images/ban-an-grand-palace.png',           1,N'HOAT_DONG'),
(6,4,1,N'Den Ban Imperial',            N'den-ban-imperial',           N'SP-IM001', N'Anh sang cua su tinh te',                          18900000, NULL,    30,N'Dong ma vang',                          N'Vang dong',     N'40x40x75 cm',   8,   N'/images/den-ban-imperial.png',              0,N'HOAT_DONG'),
(2,4,1,N'Ban Console Majestic',        N'ban-console-majestic',       N'SP-MJ001', N'Tinh xao trong tung chi tiet',                     62000000, NULL,    10,N'Go tu nhien dat vang',                  N'Vang co dien',  N'180x50x90 cm',  60,  N'/images/ban-console-majestic.png',          1,N'HOAT_DONG'),
(4,4,2,N'Giuong Imperial Majesty',     N'giuong-imperial-majesty',    N'SP-IM002', N'Giac ngu hoang gia - Dang cap vinh cuu',           98000000, NULL,    12,N'Go tu nhien boc nem cao cap',           N'Kem vang',      N'220x220 cm',    95,  N'/images/giuong-imperial-majesty.png',       1,N'HOAT_DONG'),
(5,4,1,N'Tu Trung Bay Royal Moments',  N'tu-trung-bay-royal-moments', N'SP-RM001', N'Trung bay dang cap - Gia tri vuot thoi gian',      68000000, NULL,    8, N'Go tu nhien ket hop kinh',              N'Nau go',        N'180x50x220 cm', 110, N'/images/tu-royal-moments.png',              1,N'HOAT_DONG'),
(2,5,1,N'Ban An Luxury Modern',        N'ban-an-luxury-modern',       N'SP-LM001', N'Thiet ke hien dai xa xi cho khong gian sang trong',95000000, NULL,    6, N'Go oc cho ket hop marble',              N'Trang den',     N'280x100x75 cm', 85,  N'/images/ban-an-luxury-modern.png',          1,N'HOAT_DONG'),
(1,3,1,N'Sofa Velvet Grand Elegance',  N'sofa-velvet-grand-elegance', N'SP-VGE001',N'Sofa nhung cao cap voi thiet ke quyen ru',         56000000, NULL,    18,N'Nhung cao cap, go tu nhien',            N'Xanh tuoi',     N'260x100x90 cm', 72,  N'/images/sofa-velvet-grand-elegance.png',    1,N'HOAT_DONG'),
(5,3,2,N'Tu Kinh Aura Travertine',     N'tu-kinh-aura-travertine',    N'SP-KAT001',N'Tu kinh cao cap voi khung travertine sang trong',  68500000, NULL,    5, N'Kinh cuong luc, travertine',            N'Be nau',        N'150x45x210 cm', 105, N'/images/tu-kinh-aura-travertine.png',       1,N'HOAT_DONG'),
(6,9,1,N'Den San May Tre Japandi',     N'den-san-may-tre-japandi',    N'SP-STJ001',N'Den san phong cach Japandi tu may tre tu nhien',   2890000,  2490000, 25,N'May tre tu nhien, go',                  N'Mau go tu nhien',N'40x40x150 cm', 5.5, N'/images/den-san-may-tre-japandi.png',       1,N'HOAT_DONG'),
(2,5,1,N'Ban Tra Heritage',            N'ban-tra-heritage',           N'SP-HT001', N'Hai hoa - Tinh te - Doc sac',                      29800000, NULL,    18,N'Go tu nhien cham khac',                 N'Nau vang',      N'140x80x50 cm',  40,  N'/images/ban-tra-heritage.png',              0,N'HOAT_DONG'),
(2,10,1,N'Ban Tra Imperial Stone',     N'ban-tra-imperial-stone',     N'SP-IS001', N'Kiet tac da travertine, dep toi gian, dang cap',   42500000, NULL,    12,N'Da Travertine tu nhien',                N'Be kem',        N'120x120x38 cm', 70,  N'/images/ban-tra-imperial-stone.png',        1,N'HOAT_DONG'),
(2,10,1,N'Ban Goc Imperial Stone',     N'ban-goc-imperial-stone',     N'SP-IS002', N'Thiet ke can bang giua nghe thuat va cong nang',   21900000, NULL,    18,N'Da Travertine tu nhien, kinh cuong luc',N'Be kem',        N'50x50x60 cm',   30,  N'/images/ban-goc-imperial-stone.png',        0,N'HOAT_DONG'),
(6,8,1,N'Den San Aura Minimal',        N'den-san-aura-minimal',       N'SP-AM001', N'Duong net thanh thoat, ve dep toi gian Japandi',   9800000,  NULL,    18,N'Kim loai ma vang, da tu nhien',          N'Trang kem',     N'35x35x165 cm',  12,  N'/images/den-san-aura-minimal.png',          0,N'HOAT_DONG');
GO
INSERT INTO dbo.HinhAnhSanPham (MaSanPham,DuongDanHinh,MoTaHinh,ThuTuHienThi,LaAnhDaiDien) VALUES
(1, N'/images/sofa-heritage-royale_1.png',       N'Sofa Heritage anh chinh',  1,1),
(1, N'/images/sofa-heritage-royale_2.png',       NULL,                        2,0),
(2, N'/images/ghe-louis-xv_1.png',               N'Ghe Banh Louis anh chinh', 1,1),
(2, N'/images/ghe-louis-xv_2.png',               NULL,                        2,0),
(3, N'/images/ban-an-grand-palace_1.png',          NULL,                        1,1),
(3, N'/images/ban-an-grand-palace_2.png',          NULL,                        2,0),
(4, N'/images/den-ban-imperial_1.png',             NULL,                        1,1),
(5, N'/images/ban-console-majestic_1.png',         NULL,                        1,1),
(6, N'/images/giuong-imperial-majesty_1.png',      N'Giuong Imperial anh chinh',1,1),
(6, N'/images/giuong-imperial-majesty_2.png',      NULL,                        2,0),
(6, N'/images/giuong-imperial-majesty_3.png',      NULL,                        3,0),
(7, N'/images/tu-royal-moments_1.png',             NULL,                        1,1),
(8, N'/images/ban-an-luxury-modern_1.png',         NULL,                        1,1),
(8, N'/images/ban-an-luxury-modern_2.png',         NULL,                        2,0),
(9, N'/images/sofa-velvet-grand-elegance_1.png',   NULL,                        1,1),
(9, N'/images/sofa-velvet-grand-elegance_2.png',   NULL,                        2,0),
(9, N'/images/sofa-velvet-grand-elegance_3.png',   NULL,                        3,0),
(10,N'/images/tu-kinh-aura-travertine_1.png',      NULL,                        1,1),
(11,N'/images/den-san-may-tre-japandi_1.png',      NULL,                        1,1),
(12,N'/images/ban-tra-heritage_1.png',             NULL,                        1,1),
(13,N'/images/ban-tra-imperial-stone_1.png',       NULL,                        1,1),
(13,N'/images/ban-tra-imperial-stone_2.png',       NULL,                        2,0),
(13,N'/images/ban-tra-imperial-stone_3.png',       NULL,                        3,0),
(14,N'/images/ban-goc-imperial-stone_1.png',       NULL,                        1,1),
(14,N'/images/ban-goc-imperial-stone_2.png',       NULL,                        2,0),
(15,N'/images/den-san-aura-minimal_1.png',         NULL,                        1,1);
GO
INSERT INTO dbo.BoSuuTap (TenBoSuuTap,DuongDan,MoTa,HinhAnh) VALUES
(N'Royal Heritage',           N'royal-heritage',           N'Bo suu tap noi that hoang gia sang trong, quyen quy.',N'/images_PC/royal-heritage.png'),
(N'Imperial Living',          N'imperial-living',          N'Khong gian song xa hoa phong cach cung dien chau Au.',N'/images_PC/imperial-living.png'),
(N'Luxury Modern Collection', N'luxury-modern-collection', N'Ket hop hoan hao giua thiet ke hien dai va vat lieu cao cap.',N'/images_PC/luxury-modern-collection.png'),
(N'Travertine Signature',     N'travertine-signature',     N'Bo suu tap da Travertine tinh te, dang cap.',          N'/images_PC/travertine-signature.png'),
(N'Japandi Serenity',         N'japandi-serenity',         N'Japandi toi gian, am cung, hoa hop thien nhien.',      N'/images_PC/japandi-serenity.png'),
(N'Classic Elegance',         N'classic-elegance',         N'Ve dep co dien tinh xao.',                             N'/images_PC/classic-elegance.png'),
(N'Art Of Living',            N'art-of-living',            N'Khong gian song de cao nghe thuat va su tinh te.',     N'/images_PC/art-of-living.png'),
(N'Luxury Bedroom',           N'luxury-bedroom',           N'Noi that phong ngu cao cap.',                          N'/images_PC/luxury-bedroom.png'),
(N'Grand Dining',             N'grand-dining',             N'Ban an sang trong cho bua tiec dang cap.',             N'/images_PC/grand-dining.png'),
(N'Elite Lighting',           N'elite-lighting',           N'Den trang tri cao cap tao diem nhan.',                 N'/images_PC/elite-lighting.png');
GO
INSERT INTO dbo.ChiTietBoSuuTap (MaBoSuuTap,MaSanPham,ThuTuHienThi) VALUES
(1,1,1),(1,3,2),(1,8,3),(2,6,1),(2,7,2);
GO
INSERT INTO dbo.MaGiamGia (MaCode,TenMa,KieuGiam,GiaTriGiam,DonToiThieu,GiamToiDa,NgayBatDau,NgayKetThuc,GioiHanSuDung,TrangThai) VALUES
(N'NOITHAT10',N'Giam 10% don noi that',N'PHAN_TRAM',10,    3000000,1000000,SYSDATETIME(),DATEADD(DAY,60,SYSDATETIME()),100,N'HOAT_DONG'),
(N'FREESHIP', N'Ho tro phi van chuyen', N'TIEN_MAT', 300000,2000000,NULL,   SYSDATETIME(),DATEADD(DAY,30,SYSDATETIME()),200,N'HOAT_DONG');
GO
INSERT INTO dbo.BannerQuangCao (TieuDe,TieuDePhu,HinhAnh,DuongDanLienKet,ViTri,TrangThai) VALUES
(N'Noi that hien dai cho ngoi nha cua ban',N'Kham pha bo suu tap moi nhat',N'/uploads/banners/home-banner.jpg',N'/products',                         N'TRANG_CHU_TREN', N'HOAT_DONG'),
(N'Uu dai phong khach',                    N'Giam gia nhieu mau sofa',     N'/uploads/banners/sale.jpg',        N'/collections/phong-khach-hien-dai', N'TRANG_CHU_GIUA', N'HOAT_DONG');
GO
INSERT INTO dbo.DonHang (MaDonHangCode,MaNguoiDung,TenKhachHang,SoDienThoai,DiaChiGiaoHang,GhiChu,TamTinh,TienGiam,PhiVanChuyen,TongTien,TrangThaiDonHang,PhuongThucThanhToan,TrangThaiThanhToan) VALUES
(N'DH202605270001',3,N'Nguyen Van Khach',N'0900000003',N'22 Dien Bien Phu, Da Nang',       N'Giao gio hanh chinh',78500000, 500000, 0,    78000000, N'CHO_XAC_NHAN',N'THANH_TOAN_KHI_NHAN_HANG',N'CHUA_THANH_TOAN'),
(N'DH202605270002',4,N'Tran Minh Quan',  N'0901111111',N'45 Nguyen Huu Tho, Da Nang',      N'Giao buoi sang',     56000000, 300000, 0,    55700000, N'DA_XAC_NHAN', N'THANH_TOAN_KHI_NHAN_HANG',N'CHUA_THANH_TOAN'),
(N'DH202605270003',5,N'Le Thi Hong',     N'0902222222',N'72 Tran Cao Van, Da Nang',         N'Goi truoc khi giao', 68500000, 0,      30000,68530000, N'DANG_GIAO',   N'CHUYEN_KHOAN',            N'DA_THANH_TOAN'),
(N'DH202605270004',6,N'Pham Gia Bao',    N'0903333333',N'18 Ngo Quyen, Da Nang',            NULL,                  29800000, 300000, 0,    29500000, N'HOAN_THANH',  N'MOMO',                    N'DA_THANH_TOAN'),
(N'DH202605270005',7,N'Nguyen Ngoc Anh', N'0904444444',N'12 Le Loi, Da Nang',               N'Giao sau 18h',       21900000, 0,      30000,21930000, N'CHO_XAC_NHAN',N'THANH_TOAN_KHI_NHAN_HANG',N'CHUA_THANH_TOAN'),
(N'DH202605270006',4,N'Tran Minh Quan',  N'0901111111',N'45 Nguyen Huu Tho, Da Nang',      NULL,                  9800000,  210000, 0,    9590000,  N'HOAN_THANH',  N'VNPAY',                   N'DA_THANH_TOAN'),
(N'DH202605270007',5,N'Le Thi Hong',     N'0902222222',N'72 Tran Cao Van, Da Nang',         N'Khong giao gio trua',95000000, 1000000,0,    94000000, N'DA_XAC_NHAN', N'CHUYEN_KHOAN',            N'DA_THANH_TOAN');
GO
INSERT INTO dbo.ChiTietDonHang (MaDonHang,MaSanPham,TenSanPham,DonGia,SoLuong) VALUES
(1,1, N'Sofa Heritage Royale',       78500000,1),
(2,9, N'Sofa Velvet Grand Elegance', 56000000,1),
(3,10,N'Tu Kinh Aura Travertine',    68500000,1),
(4,12,N'Ban Tra Heritage',           29800000,1),
(5,14,N'Ban Goc Imperial Stone',     21900000,1),
(6,15,N'Den San Aura Minimal',       9800000, 1),
(7,8, N'Ban An Luxury Modern',       95000000,1);
GO
INSERT INTO dbo.ThanhToan (MaDonHang,SoTien,PhuongThuc,TrangThai,MaGiaoDich,NgayThanhToan) VALUES
(1,78000000,N'THANH_TOAN_KHI_NHAN_HANG',N'DANG_CHO',  NULL,                 NULL),
(2,55700000,N'THANH_TOAN_KHI_NHAN_HANG',N'DANG_CHO',  NULL,                 NULL),
(3,68530000,N'CHUYEN_KHOAN',            N'THANH_CONG', N'CK202605270003',    SYSDATETIME()),
(4,29500000,N'MOMO',                    N'THANH_CONG', N'MOMO202605270004',  SYSDATETIME()),
(5,21930000,N'THANH_TOAN_KHI_NHAN_HANG',N'DANG_CHO',  NULL,                 NULL),
(6,9590000, N'VNPAY',                   N'THANH_CONG', N'VNPAY202605270006', SYSDATETIME()),
(7,94000000,N'CHUYEN_KHOAN',            N'THANH_CONG', N'CK202605270007',    SYSDATETIME());
GO
INSERT INTO dbo.DanhGiaSanPham (MaNguoiDung,MaSanPham,SoSao,NoiDung,TrangThai) VALUES
(3,1, 5,N'Sofa dep, mau sac dung hinh, ngoi rat em.',          N'DA_DUYET'),
(4,9, 5,N'Sofa nhung em ai, mau sac dep, giao hang nhanh.',    N'DA_DUYET'),
(5,10,4,N'Tu kinh dep, travertine sang trong.',                 N'DA_DUYET'),
(6,12,5,N'Ban tra dep, chat luong go tot.',                     N'DA_DUYET'),
(7,14,4,N'Ban goc nho gon, hop phong khach hien dai.',         N'DA_DUYET'),
(4,15,5,N'Den san rat dep, anh sang am, chuan phong cach.',    N'DA_DUYET'),
(5,8, 5,N'Ban an luxury, vat lieu cao cap, thiet ke an tuong.',N'DA_DUYET'),
(3,3, 4,N'Ban an sang trong, go chac, rat dang cap.',          N'CHO_DUYET');
GO
INSERT INTO dbo.SanPhamYeuThich (MaNguoiDung,MaSanPham) VALUES
(3,1),(3,6),(4,9),(4,12),(5,10),(5,11),(6,13),(7,14);
GO
INSERT INTO dbo.GioHang (MaNguoiDung) VALUES (3),(4),(5);
GO
INSERT INTO dbo.ChiTietGioHang (MaGioHang,MaSanPham,SoLuong) VALUES
(1,1,1),(1,3,1),(2,9,1),(2,11,1),(3,10,1);
GO
INSERT INTO dbo.BoSanPham (MaSanPhamChinh,TenBoSanPham,MoTa,TrangThai) VALUES
(1,N'Combo phong khach Hoang Gia', N'Ket hop sofa, ban console va den ban.', N'HOAT_DONG'),
(6,N'Combo phong ngu Imperial',   N'Giuong, tu trung bay cho phong ngu.',   N'HOAT_DONG');
GO
INSERT INTO dbo.ChiTietBoSanPham (MaBoSanPham,MaSanPham,SoLuong) VALUES
(1,1,1),(1,5,1),(1,4,1),(2,6,1),(2,7,1);
GO
INSERT INTO dbo.SoSanhSanPham (MaNguoiDung,MaPhien) VALUES (3,NULL),(4,NULL);
GO
INSERT INTO dbo.ChiTietSoSanh (MaSoSanh,MaSanPham) VALUES
(1,1),(1,2),(1,9),(2,6),(2,7);
GO
INSERT INTO dbo.DuAnPhoiPhong (MaNguoiDung,MaPhong,MaPhongCach,TenDuAn,HinhAnhKhongGian,ChieuRong,ChieuDai,ChieuCao,GhiChu,TrangThai) VALUES
(3,1,4,N'Phoi phong khach hoang gia',N'/uploads/designs/phong-khach.jpg',4.50,5.20,3.00,N'Phoi sofa, ban console va den ban',N'DA_LUU'),
(4,2,4,N'Phoi phong ngu Imperial',   NULL,                                4.00,4.50,3.00,N'Phoi giuong va tu cao cap',        N'NHAP');
GO
INSERT INTO dbo.ChiTietPhoiPhong (MaDuAnPhoiPhong,MaSanPham,SoLuong,ViTriX,ViTriY,TiLe,GocXoay) VALUES
(1,1,1,120,220,1.00,0),(1,5,1,150,300,0.80,0),(1,4,1,360,180,0.70,15),
(2,6,1,100,200,1.00,0),(2,7,1,300,150,0.90,0);
GO
INSERT INTO dbo.LichHenShowroom (MaNguoiDung,HoTen,SoDienThoai,Email,NgayHen,GioHen,GhiChu,TrangThai) VALUES
(3,N'Nguyen Van Khach',N'0900000003',N'khachhang@gmail.com',DATEADD(DAY,3,CAST(GETDATE() AS DATE)),'09:30',N'Muon xem sofa va ban an',      N'CHO_XAC_NHAN'),
(4,N'Tran Minh Quan',  N'0901111111',N'quan@gmail.com',      DATEADD(DAY,2,CAST(GETDATE() AS DATE)),'08:30',N'Xem sofa va ke tivi',           N'CHO_XAC_NHAN'),
(5,N'Le Thi Hong',     N'0902222222',N'hong@gmail.com',       DATEADD(DAY,4,CAST(GETDATE() AS DATE)),'14:00',N'Xem tu bep mau',                N'DA_XAC_NHAN'),
(6,N'Pham Gia Bao',    N'0903333333',N'bao@gmail.com',        DATEADD(DAY,5,CAST(GETDATE() AS DATE)),'10:00',N'Tu van phong lam viec',         N'CHO_XAC_NHAN'),
(7,N'Nguyen Ngoc Anh', N'0904444444',N'anh@gmail.com',        DATEADD(DAY,6,CAST(GETDATE() AS DATE)),'15:30',N'Xem decor phong khach',         N'CHO_XAC_NHAN'),
(4,N'Tran Minh Quan',  N'0901111111',N'quan@gmail.com',        DATEADD(DAY,8,CAST(GETDATE() AS DATE)),'09:00',N'Tu van combo phong khach',      N'DA_XAC_NHAN');
GO
INSERT INTO dbo.TinNhanLienHe (HoTen,SoDienThoai,Email,TieuDe,NoiDung,TrangThai) VALUES
(N'Le Thi Mai',   N'0912345678',N'mai@gmail.com', N'Tu van noi that phong ngu', N'Toi muon tu van giuong va tu cho phong ngu nho.', N'MOI'),
(N'Nguyen Tuan',  N'0987654321',N'tuan@gmail.com',N'Hoi ve chinh sach bao hanh',N'San pham ban an co bao hanh khong?',              N'DA_DOC'),
(N'Tran Thi Lan', N'0933445566',N'lan@gmail.com', N'Tu van sofa can ho nho',    N'Can ho toi 45m2, can sofa nho gon.',              N'MOI');
GO
SELECT N'NguoiDung'      AS Bang, COUNT(*) AS SoDong FROM dbo.NguoiDung
UNION ALL SELECT N'DanhMuc',         COUNT(*) FROM dbo.DanhMuc
UNION ALL SELECT N'PhongCach',       COUNT(*) FROM dbo.PhongCach
UNION ALL SELECT N'Phong',           COUNT(*) FROM dbo.Phong
UNION ALL SELECT N'SanPham',         COUNT(*) FROM dbo.SanPham
UNION ALL SELECT N'HinhAnhSanPham',  COUNT(*) FROM dbo.HinhAnhSanPham
UNION ALL SELECT N'BoSuuTap',        COUNT(*) FROM dbo.BoSuuTap
UNION ALL SELECT N'MaGiamGia',       COUNT(*) FROM dbo.MaGiamGia
UNION ALL SELECT N'DonHang',         COUNT(*) FROM dbo.DonHang
UNION ALL SELECT N'ChiTietDonHang',  COUNT(*) FROM dbo.ChiTietDonHang
UNION ALL SELECT N'ThanhToan',       COUNT(*) FROM dbo.ThanhToan
UNION ALL SELECT N'DanhGiaSanPham',  COUNT(*) FROM dbo.DanhGiaSanPham
UNION ALL SELECT N'SanPhamYeuThich', COUNT(*) FROM dbo.SanPhamYeuThich
UNION ALL SELECT N'GioHang',         COUNT(*) FROM dbo.GioHang
UNION ALL SELECT N'LichHenShowroom', COUNT(*) FROM dbo.LichHenShowroom
UNION ALL SELECT N'TinNhanLienHe',   COUNT(*) FROM dbo.TinNhanLienHe;
GO
