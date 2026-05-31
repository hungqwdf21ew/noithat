

IF DB_ID(N'QLNT') IS NULL
BEGIN
    CREATE DATABASE QLNT;
END
GO

USE QLNT;
GO


IF OBJECT_ID(N'dbo.ChiTietBoSanPham', N'U') IS NOT NULL DROP TABLE dbo.ChiTietBoSanPham;
IF OBJECT_ID(N'dbo.BoSanPham', N'U') IS NOT NULL DROP TABLE dbo.BoSanPham;
IF OBJECT_ID(N'dbo.ChiTietPhoiPhong', N'U') IS NOT NULL DROP TABLE dbo.ChiTietPhoiPhong;
IF OBJECT_ID(N'dbo.DuAnPhoiPhong', N'U') IS NOT NULL DROP TABLE dbo.DuAnPhoiPhong;
IF OBJECT_ID(N'dbo.ChiTietSoSanh', N'U') IS NOT NULL DROP TABLE dbo.ChiTietSoSanh;
IF OBJECT_ID(N'dbo.SoSanhSanPham', N'U') IS NOT NULL DROP TABLE dbo.SoSanhSanPham;
IF OBJECT_ID(N'dbo.TinNhanLienHe', N'U') IS NOT NULL DROP TABLE dbo.TinNhanLienHe;
IF OBJECT_ID(N'dbo.LichHenShowroom', N'U') IS NOT NULL DROP TABLE dbo.LichHenShowroom;
IF OBJECT_ID(N'dbo.BannerQuangCao', N'U') IS NOT NULL DROP TABLE dbo.BannerQuangCao;
IF OBJECT_ID(N'dbo.ChiTietBoSuuTap', N'U') IS NOT NULL DROP TABLE dbo.ChiTietBoSuuTap;
IF OBJECT_ID(N'dbo.BoSuuTap', N'U') IS NOT NULL DROP TABLE dbo.BoSuuTap;
IF OBJECT_ID(N'dbo.ThanhToan', N'U') IS NOT NULL DROP TABLE dbo.ThanhToan;
IF OBJECT_ID(N'dbo.ChiTietDonHang', N'U') IS NOT NULL DROP TABLE dbo.ChiTietDonHang;
IF OBJECT_ID(N'dbo.DonHang', N'U') IS NOT NULL DROP TABLE dbo.DonHang;
IF OBJECT_ID(N'dbo.MaGiamGia', N'U') IS NOT NULL DROP TABLE dbo.MaGiamGia;
IF OBJECT_ID(N'dbo.ChiTietGioHang', N'U') IS NOT NULL DROP TABLE dbo.ChiTietGioHang;
IF OBJECT_ID(N'dbo.GioHang', N'U') IS NOT NULL DROP TABLE dbo.GioHang;
IF OBJECT_ID(N'dbo.DanhGiaSanPham', N'U') IS NOT NULL DROP TABLE dbo.DanhGiaSanPham;
IF OBJECT_ID(N'dbo.SanPhamYeuThich', N'U') IS NOT NULL DROP TABLE dbo.SanPhamYeuThich;
IF OBJECT_ID(N'dbo.HinhAnhSanPham', N'U') IS NOT NULL DROP TABLE dbo.HinhAnhSanPham;
IF OBJECT_ID(N'dbo.SanPham', N'U') IS NOT NULL DROP TABLE dbo.SanPham;
IF OBJECT_ID(N'dbo.Phong', N'U') IS NOT NULL DROP TABLE dbo.Phong;
IF OBJECT_ID(N'dbo.PhongCach', N'U') IS NOT NULL DROP TABLE dbo.PhongCach;
IF OBJECT_ID(N'dbo.DanhMuc', N'U') IS NOT NULL DROP TABLE dbo.DanhMuc;
IF OBJECT_ID(N'dbo.DiaChiNguoiDung', N'U') IS NOT NULL DROP TABLE dbo.DiaChiNguoiDung;
IF OBJECT_ID(N'dbo.NguoiDung', N'U') IS NOT NULL DROP TABLE dbo.NguoiDung;
GO

/* ============================================================
   1. BANG NGUOI DUNG
   ============================================================ */

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

    CONSTRAINT CK_NguoiDung_VaiTro 
        CHECK (VaiTro IN (N'ADMIN', N'NHAN_VIEN', N'KHACH_HANG')),

    CONSTRAINT CK_NguoiDung_TrangThai 
        CHECK (TrangThai IN (N'HOAT_DONG', N'KHOA', N'VO_HIEU'))
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

    CONSTRAINT FK_DiaChiNguoiDung_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung)
        ON DELETE CASCADE
);
GO

/* ============================================================
   2. DANH MUC, PHONG CACH, PHONG
   ============================================================ */

CREATE TABLE dbo.DanhMuc (
    MaDanhMuc INT IDENTITY(1,1) PRIMARY KEY,
    MaDanhMucCha INT NULL,
    TenDanhMuc NVARCHAR(100) NOT NULL,
    DuongDan NVARCHAR(150) NOT NULL UNIQUE,
    MoTa NVARCHAR(500) NULL,
    HinhAnh NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_DanhMuc_DanhMucCha
        FOREIGN KEY (MaDanhMucCha) REFERENCES dbo.DanhMuc(MaDanhMuc),

    CONSTRAINT CK_DanhMuc_TrangThai 
        CHECK (TrangThai IN (N'HOAT_DONG', N'AN'))
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

/* ============================================================
   3. SAN PHAM
   ============================================================ */

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

    CONSTRAINT FK_SanPham_DanhMuc
        FOREIGN KEY (MaDanhMuc) REFERENCES dbo.DanhMuc(MaDanhMuc),

    CONSTRAINT FK_SanPham_PhongCach
        FOREIGN KEY (MaPhongCach) REFERENCES dbo.PhongCach(MaPhongCach),

    CONSTRAINT FK_SanPham_Phong
        FOREIGN KEY (MaPhong) REFERENCES dbo.Phong(MaPhong),

    CONSTRAINT CK_SanPham_GiaBan CHECK (GiaBan >= 0),
    CONSTRAINT CK_SanPham_GiaKhuyenMai CHECK (GiaKhuyenMai IS NULL OR GiaKhuyenMai >= 0),
    CONSTRAINT CK_SanPham_SoLuongTon CHECK (SoLuongTon >= 0),
    CONSTRAINT CK_SanPham_TrangThai 
        CHECK (TrangThai IN (N'HOAT_DONG', N'AN', N'HET_HANG'))
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

    CONSTRAINT FK_HinhAnhSanPham_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham)
        ON DELETE CASCADE
);
GO

/* ============================================================
   4. YEU THICH VA DANH GIA
   ============================================================ */

CREATE TABLE dbo.SanPhamYeuThich (
    MaYeuThich INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    MaSanPham INT NOT NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_SanPhamYeuThich_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung)
        ON DELETE CASCADE,

    CONSTRAINT FK_SanPhamYeuThich_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham)
        ON DELETE CASCADE,

    CONSTRAINT UQ_SanPhamYeuThich_NguoiDung_SanPham 
        UNIQUE (MaNguoiDung, MaSanPham)
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

    CONSTRAINT FK_DanhGiaSanPham_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung),

    CONSTRAINT FK_DanhGiaSanPham_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham)
        ON DELETE CASCADE,

    CONSTRAINT CK_DanhGiaSanPham_SoSao CHECK (SoSao BETWEEN 1 AND 5),
    CONSTRAINT CK_DanhGiaSanPham_TrangThai 
        CHECK (TrangThai IN (N'CHO_DUYET', N'DA_DUYET', N'TU_CHOI')),

    CONSTRAINT UQ_DanhGiaSanPham_NguoiDung_SanPham 
        UNIQUE (MaNguoiDung, MaSanPham)
);
GO

/* ============================================================
   5. GIO HANG
   ============================================================ */

CREATE TABLE dbo.GioHang (
    MaGioHang INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL UNIQUE,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,

    CONSTRAINT FK_GioHang_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung)
        ON DELETE CASCADE
);
GO

CREATE TABLE dbo.ChiTietGioHang (
    MaChiTietGioHang INT IDENTITY(1,1) PRIMARY KEY,
    MaGioHang INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat DATETIME2 NULL,

    CONSTRAINT FK_ChiTietGioHang_GioHang
        FOREIGN KEY (MaGioHang) REFERENCES dbo.GioHang(MaGioHang)
        ON DELETE CASCADE,

    CONSTRAINT FK_ChiTietGioHang_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),

    CONSTRAINT CK_ChiTietGioHang_SoLuong CHECK (SoLuong > 0),

    CONSTRAINT UQ_ChiTietGioHang_GioHang_SanPham 
        UNIQUE (MaGioHang, MaSanPham)
);
GO

/* ============================================================
   6. MA GIAM GIA, DON HANG, THANH TOAN
   ============================================================ */

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

    CONSTRAINT CK_MaGiamGia_KieuGiam 
        CHECK (KieuGiam IN (N'PHAN_TRAM', N'TIEN_MAT')),

    CONSTRAINT CK_MaGiamGia_GiaTriGiam CHECK (GiaTriGiam >= 0),
    CONSTRAINT CK_MaGiamGia_DonToiThieu CHECK (DonToiThieu >= 0),

    CONSTRAINT CK_MaGiamGia_TrangThai 
        CHECK (TrangThai IN (N'HOAT_DONG', N'AN', N'HET_HAN'))
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

    CONSTRAINT FK_DonHang_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung),

    CONSTRAINT FK_DonHang_MaGiamGia
        FOREIGN KEY (MaGiamGia) REFERENCES dbo.MaGiamGia(MaGiamGia),

    CONSTRAINT CK_DonHang_Tien 
        CHECK (TamTinh >= 0 AND TienGiam >= 0 AND PhiVanChuyen >= 0 AND TongTien >= 0),

    CONSTRAINT CK_DonHang_TrangThaiDonHang 
        CHECK (TrangThaiDonHang IN (
            N'CHO_XAC_NHAN', N'DA_XAC_NHAN', N'DANG_GIAO', N'HOAN_THANH', N'DA_HUY'
        )),

    CONSTRAINT CK_DonHang_PhuongThucThanhToan 
        CHECK (PhuongThucThanhToan IN (
            N'THANH_TOAN_KHI_NHAN_HANG', N'CHUYEN_KHOAN', N'MOMO', N'VNPAY'
        )),

    CONSTRAINT CK_DonHang_TrangThaiThanhToan 
        CHECK (TrangThaiThanhToan IN (
            N'CHUA_THANH_TOAN', N'DA_THANH_TOAN', N'THANH_TOAN_LOI', N'HOAN_TIEN'
        ))
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

    CONSTRAINT FK_ChiTietDonHang_DonHang
        FOREIGN KEY (MaDonHang) REFERENCES dbo.DonHang(MaDonHang)
        ON DELETE CASCADE,

    CONSTRAINT FK_ChiTietDonHang_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),

    CONSTRAINT CK_ChiTietDonHang_DonGia CHECK (DonGia >= 0),
    CONSTRAINT CK_ChiTietDonHang_SoLuong CHECK (SoLuong > 0)
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

    CONSTRAINT FK_ThanhToan_DonHang
        FOREIGN KEY (MaDonHang) REFERENCES dbo.DonHang(MaDonHang)
        ON DELETE CASCADE,

    CONSTRAINT CK_ThanhToan_SoTien CHECK (SoTien >= 0),

    CONSTRAINT CK_ThanhToan_PhuongThuc 
        CHECK (PhuongThuc IN (
            N'THANH_TOAN_KHI_NHAN_HANG', N'CHUYEN_KHOAN', N'MOMO', N'VNPAY'
        )),

    CONSTRAINT CK_ThanhToan_TrangThai 
        CHECK (TrangThai IN (N'DANG_CHO', N'THANH_CONG', N'THAT_BAI', N'HOAN_TIEN'))
);
GO

/* ============================================================
   7. BO SUU TAP VA BANNER
   ============================================================ */

CREATE TABLE dbo.BoSuuTap (
    MaBoSuuTap INT IDENTITY(1,1) PRIMARY KEY,
    TenBoSuuTap NVARCHAR(150) NOT NULL,
    DuongDan NVARCHAR(150) NOT NULL UNIQUE,
    MoTa NVARCHAR(1000) NULL,
    HinhAnh NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT CK_BoSuuTap_TrangThai 
        CHECK (TrangThai IN (N'HOAT_DONG', N'AN'))
);
GO

CREATE TABLE dbo.ChiTietBoSuuTap (
    MaBoSuuTap INT NOT NULL,
    MaSanPham INT NOT NULL,
    ThuTuHienThi INT NOT NULL DEFAULT 0,

    CONSTRAINT PK_ChiTietBoSuuTap 
        PRIMARY KEY (MaBoSuuTap, MaSanPham),

    CONSTRAINT FK_ChiTietBoSuuTap_BoSuuTap
        FOREIGN KEY (MaBoSuuTap) REFERENCES dbo.BoSuuTap(MaBoSuuTap)
        ON DELETE CASCADE,

    CONSTRAINT FK_ChiTietBoSuuTap_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham)
        ON DELETE CASCADE
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

    CONSTRAINT CK_BannerQuangCao_TrangThai 
        CHECK (TrangThai IN (N'HOAT_DONG', N'AN'))
);
GO

/* ============================================================
   8. LICH HEN SHOWROOM VA LIEN HE
   ============================================================ */

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

    CONSTRAINT FK_LichHenShowroom_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung),

    CONSTRAINT CK_LichHenShowroom_TrangThai 
        CHECK (TrangThai IN (N'CHO_XAC_NHAN', N'DA_XAC_NHAN', N'DA_HUY', N'HOAN_THANH'))
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

    CONSTRAINT CK_TinNhanLienHe_TrangThai 
        CHECK (TrangThai IN (N'MOI', N'DA_DOC', N'DA_TRA_LOI'))
);
GO

/* ============================================================
   9. SO SANH SAN PHAM
   ============================================================ */

CREATE TABLE dbo.SoSanhSanPham (
    MaSoSanh INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NULL,
    MaPhien NVARCHAR(100) NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_SoSanhSanPham_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung)
        ON DELETE CASCADE
);
GO

CREATE TABLE dbo.ChiTietSoSanh (
    MaChiTietSoSanh INT IDENTITY(1,1) PRIMARY KEY,
    MaSoSanh INT NOT NULL,
    MaSanPham INT NOT NULL,
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_ChiTietSoSanh_SoSanhSanPham
        FOREIGN KEY (MaSoSanh) REFERENCES dbo.SoSanhSanPham(MaSoSanh)
        ON DELETE CASCADE,

    CONSTRAINT FK_ChiTietSoSanh_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham)
        ON DELETE CASCADE,

    CONSTRAINT UQ_ChiTietSoSanh_SoSanh_SanPham 
        UNIQUE (MaSoSanh, MaSanPham)
);
GO

/* ============================================================
   10. PHOI NOI THAT TRONG KHONG GIAN CA NHAN
   ============================================================ */

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

    CONSTRAINT FK_DuAnPhoiPhong_NguoiDung
        FOREIGN KEY (MaNguoiDung) REFERENCES dbo.NguoiDung(MaNguoiDung)
        ON DELETE CASCADE,

    CONSTRAINT FK_DuAnPhoiPhong_Phong
        FOREIGN KEY (MaPhong) REFERENCES dbo.Phong(MaPhong),

    CONSTRAINT FK_DuAnPhoiPhong_PhongCach
        FOREIGN KEY (MaPhongCach) REFERENCES dbo.PhongCach(MaPhongCach),

    CONSTRAINT CK_DuAnPhoiPhong_TrangThai 
        CHECK (TrangThai IN (N'NHAP', N'DA_LUU', N'LUU_TRU'))
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

    CONSTRAINT FK_ChiTietPhoiPhong_DuAnPhoiPhong
        FOREIGN KEY (MaDuAnPhoiPhong) REFERENCES dbo.DuAnPhoiPhong(MaDuAnPhoiPhong)
        ON DELETE CASCADE,

    CONSTRAINT FK_ChiTietPhoiPhong_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),

    CONSTRAINT CK_ChiTietPhoiPhong_SoLuong CHECK (SoLuong > 0)
);
GO

/* ============================================================
   11. KET HOP SAN PHAM / BO SAN PHAM
   ============================================================ */

CREATE TABLE dbo.BoSanPham (
    MaBoSanPham INT IDENTITY(1,1) PRIMARY KEY,
    MaSanPhamChinh INT NOT NULL,
    TenBoSanPham NVARCHAR(150) NOT NULL,
    MoTa NVARCHAR(1000) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'HOAT_DONG',
    NgayTao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_BoSanPham_SanPham
        FOREIGN KEY (MaSanPhamChinh) REFERENCES dbo.SanPham(MaSanPham),

    CONSTRAINT CK_BoSanPham_TrangThai 
        CHECK (TrangThai IN (N'HOAT_DONG', N'AN'))
);
GO

CREATE TABLE dbo.ChiTietBoSanPham (
    MaChiTietBoSanPham INT IDENTITY(1,1) PRIMARY KEY,
    MaBoSanPham INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,

    CONSTRAINT FK_ChiTietBoSanPham_BoSanPham
        FOREIGN KEY (MaBoSanPham) REFERENCES dbo.BoSanPham(MaBoSanPham)
        ON DELETE CASCADE,

    CONSTRAINT FK_ChiTietBoSanPham_SanPham
        FOREIGN KEY (MaSanPham) REFERENCES dbo.SanPham(MaSanPham),

    CONSTRAINT CK_ChiTietBoSanPham_SoLuong CHECK (SoLuong > 0),

    CONSTRAINT UQ_ChiTietBoSanPham_Bo_SanPham 
        UNIQUE (MaBoSanPham, MaSanPham)
);
GO

/* ============================================================
   INDEX - TANG TOC TRUY VAN
   ============================================================ */

CREATE INDEX IX_SanPham_MaDanhMuc ON dbo.SanPham(MaDanhMuc);
CREATE INDEX IX_SanPham_MaPhongCach ON dbo.SanPham(MaPhongCach);
CREATE INDEX IX_SanPham_MaPhong ON dbo.SanPham(MaPhong);
CREATE INDEX IX_SanPham_TenSanPham ON dbo.SanPham(TenSanPham);
CREATE INDEX IX_SanPham_GiaBan ON dbo.SanPham(GiaBan);

CREATE INDEX IX_DonHang_MaNguoiDung ON dbo.DonHang(MaNguoiDung);
CREATE INDEX IX_DonHang_TrangThai ON dbo.DonHang(TrangThaiDonHang);
CREATE INDEX IX_DonHang_MaDonHangCode ON dbo.DonHang(MaDonHangCode);

CREATE INDEX IX_ChiTietDonHang_MaDonHang ON dbo.ChiTietDonHang(MaDonHang);
CREATE INDEX IX_ChiTietDonHang_MaSanPham ON dbo.ChiTietDonHang(MaSanPham);

CREATE INDEX IX_DanhGiaSanPham_MaSanPham ON dbo.DanhGiaSanPham(MaSanPham);
CREATE INDEX IX_SanPhamYeuThich_MaNguoiDung ON dbo.SanPhamYeuThich(MaNguoiDung);
GO

/* ============================================================
   DU LIEU MAU
   ============================================================ */

INSERT INTO dbo.NguoiDung (HoTen, Email, MatKhauHash, SoDienThoai, VaiTro, TrangThai)
VALUES
(N'Quản trị viên', N'admin@noithat.com', N'$2a$10$hash_mau_thay_bang_bcryptjs', N'0900000001', N'ADMIN', N'HOAT_DONG'),
(N'Nhân viên bán hàng', N'nhanvien@noithat.com', N'$2a$10$hash_mau_thay_bang_bcryptjs', N'0900000002', N'NHAN_VIEN', N'HOAT_DONG'),
(N'Nguyễn Văn Khách', N'khachhang@gmail.com', N'$2a$10$hash_mau_thay_bang_bcryptjs', N'0900000003', N'KHACH_HANG', N'HOAT_DONG');
GO

INSERT INTO dbo.DanhMuc (TenDanhMuc, DuongDan, MoTa, HinhAnh)
VALUES
(N'Sofa', N'sofa', N'Các mẫu sofa phòng khách hiện đại', N'/uploads/categories/sofa.jpg'),
(N'Bàn', N'ban', N'Bàn trà, bàn ăn, bàn làm việc', N'/uploads/categories/ban.jpg'),
(N'Ghế', N'ghe', N'Ghế ăn, ghế làm việc, ghế thư giãn', N'/uploads/categories/ghe.jpg'),
(N'Giường', N'giuong', N'Giường ngủ nhiều phong cách', N'/uploads/categories/giuong.jpg'),
(N'Tủ', N'tu', N'Tủ quần áo, tủ trang trí, tủ bếp', N'/uploads/categories/tu.jpg'),
(N'Đèn trang trí', N'den-trang-tri', N'Đèn bàn, đèn sàn, đèn treo', N'/uploads/categories/den.jpg');
GO

INSERT INTO dbo.PhongCach (TenPhongCach, DuongDan, MoTa, HinhAnh)
VALUES
(N'Tối giản', N'toi-gian', N'Phong cách tối giản, tinh gọn, nhẹ nhàng', N'/uploads/styles/toi-gian.jpg'),
(N'Hiện đại', N'hien-dai', N'Phong cách hiện đại, tiện nghi', N'/uploads/styles/hien-dai.jpg'),
(N'Sang trọng', N'sang-trong', N'Phong cách cao cấp, thanh lịch', N'/uploads/styles/sang-trong.jpg'),
(N'Cổ điển', N'co-dien', N'Phong cách cổ điển, trang nhã', N'/uploads/styles/co-dien.jpg'),
(N'Bắc Âu', N'bac-au', N'Phong cách Scandinavian sáng màu', N'/uploads/styles/bac-au.jpg');
GO

INSERT INTO dbo.Phong (TenPhong, DuongDan, MoTa)
VALUES
(N'Phòng khách', N'phong-khach', N'Không gian tiếp khách và sinh hoạt chung'),
(N'Phòng ngủ', N'phong-ngu', N'Không gian nghỉ ngơi'),
(N'Phòng bếp', N'phong-bep', N'Không gian ăn uống và nấu nướng'),
(N'Phòng làm việc', N'phong-lam-viec', N'Không gian học tập, làm việc'),
(N'Ban công', N'ban-cong', N'Không gian thư giãn ngoài trời');
GO

INSERT INTO dbo.SanPham
(MaDanhMuc, MaPhongCach, MaPhong, TenSanPham, DuongDan, MaSKU, MoTa, GiaBan, GiaKhuyenMai, SoLuongTon, ChatLieu, MauSac, KichThuoc, KhoiLuong, HinhAnhChinh, LaNoiBat, TrangThai)
VALUES
(1, 2, 1, N'Sofa vải hiện đại 3 chỗ', N'sofa-vai-hien-dai-3-cho', N'SF001',
 N'Mẫu sofa vải hiện đại phù hợp phòng khách chung cư.', 8500000, 7900000, 15, N'Vải bố, gỗ tự nhiên', N'Xám', N'210x85x80 cm', 45, N'/uploads/products/sofa-1.jpg', 1, N'HOAT_DONG'),

(1, 3, 1, N'Sofa da cao cấp', N'sofa-da-cao-cap', N'SF002',
 N'Sofa da sang trọng dành cho phòng khách lớn.', 18500000, NULL, 8, N'Da công nghiệp cao cấp, gỗ', N'Nâu', N'230x90x85 cm', 60, N'/uploads/products/sofa-2.jpg', 1, N'HOAT_DONG'),

(2, 1, 1, N'Bàn trà gỗ tối giản', N'ban-tra-go-toi-gian', N'BT001',
 N'Bàn trà nhỏ gọn phong cách tối giản.', 2500000, 2200000, 25, N'Gỗ MDF phủ veneer', N'Nâu sáng', N'100x55x40 cm', 18, N'/uploads/products/ban-tra-1.jpg', 1, N'HOAT_DONG'),

(2, 5, 3, N'Bàn ăn Bắc Âu 4 ghế', N'ban-an-bac-au-4-ghe', N'BA001',
 N'Bàn ăn phong cách Bắc Âu kèm 4 ghế.', 6900000, NULL, 12, N'Gỗ cao su, nệm vải', N'Trắng - gỗ', N'120x75x75 cm', 38, N'/uploads/products/ban-an-1.jpg', 1, N'HOAT_DONG'),

(3, 2, 4, N'Ghế làm việc ergonomic', N'ghe-lam-viec-ergonomic', N'GH001',
 N'Ghế làm việc công thái học hỗ trợ lưng.', 3200000, 2900000, 30, N'Lưới, kim loại', N'Đen', N'65x65x110 cm', 16, N'/uploads/products/ghe-1.jpg', 0, N'HOAT_DONG'),

(4, 1, 2, N'Giường ngủ gỗ tối giản', N'giuong-ngu-go-toi-gian', N'GN001',
 N'Giường ngủ thiết kế tối giản, phù hợp phòng ngủ hiện đại.', 7900000, NULL, 10, N'Gỗ công nghiệp MDF', N'Nâu gỗ', N'160x200 cm', 55, N'/uploads/products/giuong-1.jpg', 1, N'HOAT_DONG'),

(5, 2, 2, N'Tủ quần áo 3 cánh', N'tu-quan-ao-3-canh', N'TU001',
 N'Tủ quần áo 3 cánh rộng rãi, thiết kế hiện đại.', 6200000, 5900000, 14, N'Gỗ MDF chống ẩm', N'Trắng', N'180x55x200 cm', 70, N'/uploads/products/tu-1.jpg', 0, N'HOAT_DONG'),

(6, 3, 1, N'Đèn sàn trang trí phòng khách', N'den-san-trang-tri-phong-khach', N'DE001',
 N'Đèn sàn ánh sáng ấm, tạo điểm nhấn thẩm mỹ.', 1450000, NULL, 40, N'Kim loại, vải', N'Vàng đồng', N'40x40x160 cm', 6, N'/uploads/products/den-1.jpg', 0, N'HOAT_DONG');
GO

INSERT INTO dbo.HinhAnhSanPham (MaSanPham, DuongDanHinh, MoTaHinh, ThuTuHienThi, LaAnhDaiDien)
VALUES
(1, N'/uploads/products/sofa-1.jpg', N'Sofa vải hiện đại ảnh chính', 1, 1),
(1, N'/uploads/products/sofa-1-2.jpg', N'Sofa vải hiện đại góc nghiêng', 2, 0),
(2, N'/uploads/products/sofa-2.jpg', N'Sofa da cao cấp ảnh chính', 1, 1),
(3, N'/uploads/products/ban-tra-1.jpg', N'Bàn trà gỗ tối giản', 1, 1),
(4, N'/uploads/products/ban-an-1.jpg', N'Bàn ăn Bắc Âu', 1, 1),
(5, N'/uploads/products/ghe-1.jpg', N'Ghế làm việc ergonomic', 1, 1),
(6, N'/uploads/products/giuong-1.jpg', N'Giường ngủ gỗ tối giản', 1, 1),
(7, N'/uploads/products/tu-1.jpg', N'Tủ quần áo 3 cánh', 1, 1),
(8, N'/uploads/products/den-1.jpg', N'Đèn sàn trang trí', 1, 1);
GO

INSERT INTO dbo.BoSuuTap (TenBoSuuTap, DuongDan, MoTa, HinhAnh)
VALUES
(N'Phòng khách hiện đại', N'phong-khach-hien-dai', N'Bộ sưu tập nội thất phòng khách hiện đại', N'/uploads/collections/phong-khach.jpg'),
(N'Phòng ngủ tối giản', N'phong-ngu-toi-gian', N'Bộ sưu tập phòng ngủ nhẹ nhàng, tinh gọn', N'/uploads/collections/phong-ngu.jpg');
GO

INSERT INTO dbo.ChiTietBoSuuTap (MaBoSuuTap, MaSanPham, ThuTuHienThi)
VALUES
(1, 1, 1),
(1, 3, 2),
(1, 8, 3),
(2, 6, 1),
(2, 7, 2);
GO

INSERT INTO dbo.MaGiamGia (MaCode, TenMa, KieuGiam, GiaTriGiam, DonToiThieu, GiamToiDa, NgayBatDau, NgayKetThuc, GioiHanSuDung, TrangThai)
VALUES
(N'NOITHAT10', N'Giảm 10% đơn nội thất', N'PHAN_TRAM', 10, 3000000, 1000000, SYSDATETIME(), DATEADD(DAY, 60, SYSDATETIME()), 100, N'HOAT_DONG'),
(N'FREESHIP', N'Hỗ trợ phí vận chuyển', N'TIEN_MAT', 300000, 2000000, NULL, SYSDATETIME(), DATEADD(DAY, 30, SYSDATETIME()), 200, N'HOAT_DONG');
GO

INSERT INTO dbo.BannerQuangCao (TieuDe, TieuDePhu, HinhAnh, DuongDanLienKet, ViTri, TrangThai)
VALUES
(N'Nội thất hiện đại cho ngôi nhà của bạn', N'Khám phá bộ sưu tập sofa, bàn, ghế, giường, tủ mới nhất', N'/uploads/banners/home-banner.jpg', N'/products', N'TRANG_CHU_TREN', N'HOAT_DONG'),
(N'Ưu đãi phòng khách', N'Giảm giá nhiều mẫu sofa và bàn trà', N'/uploads/banners/sale.jpg', N'/collections/phong-khach-hien-dai', N'TRANG_CHU_GIUA', N'HOAT_DONG');
GO

INSERT INTO dbo.DanhGiaSanPham (MaNguoiDung, MaSanPham, SoSao, NoiDung, TrangThai)
VALUES
(3, 1, 5, N'Sofa đẹp, màu sắc đúng hình, ngồi êm.', N'DA_DUYET'),
(3, 3, 4, N'Bàn trà gọn, phù hợp phòng khách nhỏ.', N'DA_DUYET');
GO

INSERT INTO dbo.SanPhamYeuThich (MaNguoiDung, MaSanPham)
VALUES
(3, 1),
(3, 6);
GO

INSERT INTO dbo.GioHang (MaNguoiDung)
VALUES
(3);
GO

INSERT INTO dbo.ChiTietGioHang (MaGioHang, MaSanPham, SoLuong)
VALUES
(1, 1, 1),
(1, 3, 1);
GO

INSERT INTO dbo.DonHang
(MaDonHangCode, MaNguoiDung, TenKhachHang, SoDienThoai, DiaChiGiaoHang, GhiChu, TamTinh, TienGiam, PhiVanChuyen, TongTien, TrangThaiDonHang, PhuongThucThanhToan, TrangThaiThanhToan)
VALUES
(N'DH202605270001', 3, N'Nguyễn Văn Khách', N'0900000003', N'Đà Nẵng', N'Giao giờ hành chính', 11000000, 500000, 0, 10500000, N'CHO_XAC_NHAN', N'THANH_TOAN_KHI_NHAN_HANG', N'CHUA_THANH_TOAN');
GO

INSERT INTO dbo.ChiTietDonHang (MaDonHang, MaSanPham, TenSanPham, DonGia, SoLuong)
VALUES
(1, 1, N'Sofa vải hiện đại 3 chỗ', 7900000, 1),
(1, 3, N'Bàn trà gỗ tối giản', 2200000, 1);
GO

INSERT INTO dbo.ThanhToan (MaDonHang, SoTien, PhuongThuc, TrangThai)
VALUES
(1, 10500000, N'THANH_TOAN_KHI_NHAN_HANG', N'DANG_CHO');
GO

INSERT INTO dbo.BoSanPham (MaSanPhamChinh, TenBoSanPham, MoTa, TrangThai)
VALUES
(1, N'Combo phòng khách hiện đại', N'Kết hợp sofa, bàn trà và đèn sàn cho phòng khách.', N'HOAT_DONG');
GO

INSERT INTO dbo.ChiTietBoSanPham (MaBoSanPham, MaSanPham, SoLuong)
VALUES
(1, 3, 1),
(1, 8, 1);
GO

INSERT INTO dbo.SoSanhSanPham (MaNguoiDung, MaPhien)
VALUES
(3, NULL);
GO

INSERT INTO dbo.ChiTietSoSanh (MaSoSanh, MaSanPham)
VALUES
(1, 1),
(1, 2),
(1, 3);
GO

INSERT INTO dbo.DuAnPhoiPhong (MaNguoiDung, MaPhong, MaPhongCach, TenDuAn, HinhAnhKhongGian, ChieuRong, ChieuDai, ChieuCao, GhiChu, TrangThai)
VALUES
(3, 1, 2, N'Phối phòng khách căn hộ', N'/uploads/designs/phong-khach-user.jpg', 4.50, 5.20, 3.00, N'Phối sofa, bàn trà và đèn sàn', N'DA_LUU');
GO

INSERT INTO dbo.ChiTietPhoiPhong (MaDuAnPhoiPhong, MaSanPham, SoLuong, ViTriX, ViTriY, TiLe, GocXoay)
VALUES
(1, 1, 1, 120, 220, 1.00, 0),
(1, 3, 1, 150, 300, 0.80, 0),
(1, 8, 1, 360, 180, 0.70, 15);
GO

INSERT INTO dbo.LichHenShowroom (MaNguoiDung, HoTen, SoDienThoai, Email, NgayHen, GioHen, GhiChu, TrangThai)
VALUES
(3, N'Nguyễn Văn Khách', N'0900000003', N'khachhang@gmail.com', DATEADD(DAY, 3, CAST(GETDATE() AS DATE)), '09:30', N'Muốn xem sofa và bàn ăn', N'CHO_XAC_NHAN');
GO

INSERT INTO dbo.TinNhanLienHe (HoTen, SoDienThoai, Email, TieuDe, NoiDung, TrangThai)
VALUES
(N'Lê Thị Mai', N'0912345678', N'mai@gmail.com', N'Tư vấn nội thất phòng ngủ', N'Tôi muốn tư vấn giường và tủ cho phòng ngủ nhỏ.', N'MOI');
GO

/* ============================================================
   KIEM TRA DU LIEU SAU KHI CHAY
   ============================================================ */

SELECT N'NguoiDung' AS TenBang, COUNT(*) AS SoDong FROM dbo.NguoiDung
UNION ALL SELECT N'DanhMuc', COUNT(*) FROM dbo.DanhMuc
UNION ALL SELECT N'PhongCach', COUNT(*) FROM dbo.PhongCach
UNION ALL SELECT N'Phong', COUNT(*) FROM dbo.Phong
UNION ALL SELECT N'SanPham', COUNT(*) FROM dbo.SanPham
UNION ALL SELECT N'DonHang', COUNT(*) FROM dbo.DonHang;
GO



/* ============================================================
   PHAN INSERT BO SUNG
   CAC LENH DUOI DAY THEM DU LIEU MAU CHO CAC BANG CHINH
   ============================================================ */


/* ============================================================
   FILE INSERT DU LIEU MAU
   CSDL: QuanLyNoiThatDB
   Dung sau khi da chay file database_tieng_viet.sql
   ============================================================ */


GO

/* ============================================================
   1. INSERT NGUOI DUNG - 6 DONG
   Ghi chu: MatKhauHash chi la mau, khi lam that nen dung bcryptjs
   ============================================================ */

INSERT INTO dbo.NguoiDung
(HoTen, Email, MatKhauHash, SoDienThoai, VaiTro, TrangThai)
VALUES
(N'Trần Minh Quân', N'quan@gmail.com', N'$2a$10$hash_mau_1', N'0901111111', N'KHACH_HANG', N'HOAT_DONG'),
(N'Lê Thị Hồng', N'hong@gmail.com', N'$2a$10$hash_mau_2', N'0902222222', N'KHACH_HANG', N'HOAT_DONG'),
(N'Phạm Gia Bảo', N'bao@gmail.com', N'$2a$10$hash_mau_3', N'0903333333', N'KHACH_HANG', N'HOAT_DONG'),
(N'Nguyễn Ngọc Anh', N'anh@gmail.com', N'$2a$10$hash_mau_4', N'0904444444', N'KHACH_HANG', N'HOAT_DONG'),
(N'Hoàng Văn Nam', N'nam@gmail.com', N'$2a$10$hash_mau_5', N'0905555555', N'NHAN_VIEN', N'HOAT_DONG'),
(N'Đặng Thanh Tú', N'tu@gmail.com', N'$2a$10$hash_mau_6', N'0906666666', N'ADMIN', N'HOAT_DONG');
GO

/* ============================================================
   2. INSERT DIA CHI NGUOI DUNG - 6 DONG
   ============================================================ */

INSERT INTO dbo.DiaChiNguoiDung
(MaNguoiDung, TenNguoiNhan, SoDienThoai, DiaChiChiTiet, PhuongXa, QuanHuyen, TinhThanh, LaMacDinh)
VALUES
(1, N'Quản trị viên', N'0900000001', N'01 Nguyễn Văn Linh', N'Hải Châu 1', N'Hải Châu', N'Đà Nẵng', 1),
(2, N'Nhân viên bán hàng', N'0900000002', N'15 Lê Duẩn', N'Thạch Thang', N'Hải Châu', N'Đà Nẵng', 1),
(3, N'Nguyễn Văn Khách', N'0900000003', N'22 Điện Biên Phủ', N'Chính Gián', N'Thanh Khê', N'Đà Nẵng', 1),
(4, N'Trần Minh Quân', N'0901111111', N'45 Nguyễn Hữu Thọ', N'Hòa Thuận Tây', N'Hải Châu', N'Đà Nẵng', 1),
(5, N'Lê Thị Hồng', N'0902222222', N'72 Trần Cao Vân', N'Tam Thuận', N'Thanh Khê', N'Đà Nẵng', 1),
(6, N'Phạm Gia Bảo', N'0903333333', N'18 Ngô Quyền', N'An Hải Bắc', N'Sơn Trà', N'Đà Nẵng', 1);
GO

/* ============================================================
   3. INSERT DANH MUC - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.DanhMuc
(TenDanhMuc, DuongDan, MoTa, HinhAnh)
VALUES
(N'Kệ trang trí', N'ke-trang-tri', N'Kệ sách, kệ tivi, kệ treo tường', N'/uploads/categories/ke-trang-tri.jpg'),
(N'Tủ bếp', N'tu-bep', N'Tủ bếp hiện đại cho căn hộ và nhà phố', N'/uploads/categories/tu-bep.jpg'),
(N'Bàn làm việc', N'ban-lam-viec', N'Bàn làm việc tại nhà và văn phòng', N'/uploads/categories/ban-lam-viec.jpg'),
(N'Ghế thư giãn', N'ghe-thu-gian', N'Ghế đọc sách, ghế nghỉ, ghế ban công', N'/uploads/categories/ghe-thu-gian.jpg'),
(N'Trang trí nhà', N'trang-tri-nha', N'Đồ decor, tranh, gương, thảm', N'/uploads/categories/trang-tri-nha.jpg'),
(N'Tủ giày', N'tu-giay', N'Tủ giày gỗ, tủ giày thông minh', N'/uploads/categories/tu-giay.jpg');
GO

/* ============================================================
   4. INSERT PHONG CACH - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.PhongCach
(TenPhongCach, DuongDan, MoTa, HinhAnh)
VALUES
(N'Industrial', N'industrial', N'Phong cách công nghiệp mạnh mẽ, cá tính', N'/uploads/styles/industrial.jpg'),
(N'Vintage', N'vintage', N'Phong cách hoài cổ, ấm áp', N'/uploads/styles/vintage.jpg'),
(N'Japandi', N'japandi', N'Kết hợp Nhật Bản và Bắc Âu', N'/uploads/styles/japandi.jpg'),
(N'Tropical', N'tropical', N'Phong cách nhiệt đới tươi mát', N'/uploads/styles/tropical.jpg'),
(N'Luxury Modern', N'luxury-modern', N'Hiện đại kết hợp sang trọng', N'/uploads/styles/luxury-modern.jpg'),
(N'Rustic', N'rustic', N'Phong cách mộc mạc, gần gũi thiên nhiên', N'/uploads/styles/rustic.jpg');
GO

/* ============================================================
   5. INSERT PHONG - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.Phong
(TenPhong, DuongDan, MoTa)
VALUES
(N'Phòng ăn', N'phong-an', N'Không gian ăn uống của gia đình'),
(N'Phòng trẻ em', N'phong-tre-em', N'Không gian học tập và nghỉ ngơi cho trẻ'),
(N'Sảnh vào nhà', N'sanh-vao-nha', N'Không gian lối vào và để giày dép'),
(N'Sân vườn', N'san-vuon', N'Không gian ngoài trời, thư giãn'),
(N'Căn hộ studio', N'can-ho-studio', N'Không gian nhỏ cần tối ưu nội thất'),
(N'Phòng thay đồ', N'phong-thay-do', N'Không gian lưu trữ quần áo, phụ kiện');
GO

/* ============================================================
   6. INSERT SAN PHAM - THEM 6 DONG
   Luu y: MaDanhMuc, MaPhongCach, MaPhong phu thuoc du lieu da co
   ============================================================ */

INSERT INTO dbo.SanPham
(MaDanhMuc, MaPhongCach, MaPhong, TenSanPham, DuongDan, MaSKU, MoTa, GiaBan, GiaKhuyenMai, SoLuongTon, ChatLieu, MauSac, KichThuoc, KhoiLuong, HinhAnhChinh, LaNoiBat, TrangThai)
VALUES
(7, 6, 1, N'Kệ tivi gỗ công nghiệp hiện đại', N'ke-tivi-go-cong-nghiep-hien-dai', N'KT001',
 N'Kệ tivi thiết kế đơn giản, phù hợp phòng khách hiện đại.', 4200000, 3900000, 18, N'Gỗ MDF phủ melamine', N'Nâu óc chó', N'180x40x45 cm', 35, N'/uploads/products/ke-tivi-1.jpg', 1, N'HOAT_DONG'),

(8, 10, 3, N'Tủ bếp chữ L màu trắng', N'tu-bep-chu-l-mau-trang', N'TB001',
 N'Tủ bếp chữ L tối ưu diện tích, phù hợp căn hộ.', 16500000, 15500000, 6, N'Gỗ MDF chống ẩm', N'Trắng', N'260x180x220 cm', 120, N'/uploads/products/tu-bep-1.jpg', 1, N'HOAT_DONG'),

(9, 2, 4, N'Bàn làm việc có hộc kéo', N'ban-lam-viec-co-hoc-keo', N'BLV001',
 N'Bàn làm việc nhỏ gọn có hộc kéo tiện dụng.', 2800000, NULL, 22, N'Gỗ công nghiệp, khung sắt', N'Đen - gỗ', N'120x60x75 cm', 25, N'/uploads/products/ban-lam-viec-1.jpg', 0, N'HOAT_DONG'),

(10, 8, 5, N'Ghế thư giãn đọc sách', N'ghe-thu-gian-doc-sach', N'GTG001',
 N'Ghế thư giãn bọc vải mềm, thích hợp đọc sách.', 3600000, 3300000, 13, N'Vải nhung, chân gỗ', N'Xanh rêu', N'75x80x95 cm', 20, N'/uploads/products/ghe-thu-gian-1.jpg', 1, N'HOAT_DONG'),

(11, 7, 1, N'Gương trang trí viền gỗ', N'guong-trang-tri-vien-go', N'GTT001',
 N'Gương treo tường viền gỗ tạo điểm nhấn cho không gian.', 1250000, NULL, 35, N'Gương, gỗ tự nhiên', N'Nâu sáng', N'60x90 cm', 8, N'/uploads/products/guong-1.jpg', 0, N'HOAT_DONG'),

(12, 3, 3, N'Tủ giày thông minh 4 tầng', N'tu-giay-thong-minh-4-tang', N'TG001',
 N'Tủ giày tiết kiệm diện tích, có nhiều ngăn chứa.', 3100000, 2890000, 16, N'Gỗ MDF phủ melamine', N'Trắng - nâu', N'100x35x110 cm', 30, N'/uploads/products/tu-giay-1.jpg', 0, N'HOAT_DONG');
GO

/* ============================================================
   7. INSERT HINH ANH SAN PHAM - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.HinhAnhSanPham
(MaSanPham, DuongDanHinh, MoTaHinh, ThuTuHienThi, LaAnhDaiDien)
VALUES
(9, N'/uploads/products/ke-tivi-1.jpg', N'Ảnh chính kệ tivi', 1, 1),
(10, N'/uploads/products/tu-bep-1.jpg', N'Ảnh chính tủ bếp chữ L', 1, 1),
(11, N'/uploads/products/ban-lam-viec-1.jpg', N'Ảnh chính bàn làm việc', 1, 1),
(12, N'/uploads/products/ghe-thu-gian-1.jpg', N'Ảnh chính ghế thư giãn', 1, 1),
(13, N'/uploads/products/guong-1.jpg', N'Ảnh chính gương trang trí', 1, 1),
(14, N'/uploads/products/tu-giay-1.jpg', N'Ảnh chính tủ giày', 1, 1);
GO

/* ============================================================
   8. INSERT BO SUU TAP - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.BoSuuTap
(TenBoSuuTap, DuongDan, MoTa, HinhAnh)
VALUES
(N'Góc làm việc tại nhà', N'goc-lam-viec-tai-nha', N'Bộ sản phẩm cho không gian làm việc tại nhà', N'/uploads/collections/goc-lam-viec.jpg'),
(N'Không gian bếp hiện đại', N'khong-gian-bep-hien-dai', N'Bộ sưu tập nội thất bếp tiện nghi', N'/uploads/collections/bep-hien-dai.jpg'),
(N'Ban công thư giãn', N'ban-cong-thu-gian', N'Nội thất nhỏ gọn cho ban công', N'/uploads/collections/ban-cong.jpg'),
(N'Căn hộ tối giản', N'can-ho-toi-gian', N'Gợi ý nội thất cho căn hộ nhỏ', N'/uploads/collections/can-ho-toi-gian.jpg'),
(N'Phòng ăn gia đình', N'phong-an-gia-dinh', N'Bàn ghế và trang trí phòng ăn', N'/uploads/collections/phong-an.jpg'),
(N'Phòng khách sang trọng', N'phong-khach-sang-trong', N'Sản phẩm cao cấp cho phòng khách', N'/uploads/collections/phong-khach-sang.jpg');
GO

/* ============================================================
   9. INSERT DON HANG - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.DonHang
(MaDonHangCode, MaNguoiDung, TenKhachHang, SoDienThoai, DiaChiGiaoHang, GhiChu, TamTinh, TienGiam, PhiVanChuyen, TongTien, TrangThaiDonHang, PhuongThucThanhToan, TrangThaiThanhToan)
VALUES
(N'DH202605270002', 4, N'Trần Minh Quân', N'0901111111', N'45 Nguyễn Hữu Thọ, Đà Nẵng', N'Giao buổi sáng', 4200000, 300000, 0, 3900000, N'DA_XAC_NHAN', N'THANH_TOAN_KHI_NHAN_HANG', N'CHUA_THANH_TOAN'),
(N'DH202605270003', 5, N'Lê Thị Hồng', N'0902222222', N'72 Trần Cao Vân, Đà Nẵng', N'Gọi trước khi giao', 2800000, 0, 30000, 2830000, N'DANG_GIAO', N'CHUYEN_KHOAN', N'DA_THANH_TOAN'),
(N'DH202605270004', 6, N'Phạm Gia Bảo', N'0903333333', N'18 Ngô Quyền, Đà Nẵng', NULL, 3600000, 300000, 0, 3300000, N'HOAN_THANH', N'MOMO', N'DA_THANH_TOAN'),
(N'DH202605270005', 7, N'Nguyễn Ngọc Anh', N'0904444444', N'12 Lê Lợi, Đà Nẵng', N'Giao sau 18h', 1250000, 0, 30000, 1280000, N'CHO_XAC_NHAN', N'THANH_TOAN_KHI_NHAN_HANG', N'CHUA_THANH_TOAN'),
(N'DH202605270006', 4, N'Trần Minh Quân', N'0901111111', N'45 Nguyễn Hữu Thọ, Đà Nẵng', NULL, 3100000, 210000, 0, 2890000, N'HOAN_THANH', N'VNPAY', N'DA_THANH_TOAN'),
(N'DH202605270007', 5, N'Lê Thị Hồng', N'0902222222', N'72 Trần Cao Vân, Đà Nẵng', N'Không giao giờ trưa', 16500000, 1000000, 0, 15500000, N'DA_XAC_NHAN', N'CHUYEN_KHOAN', N'DA_THANH_TOAN');
GO

/* ============================================================
   10. INSERT CHI TIET DON HANG - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.ChiTietDonHang
(MaDonHang, MaSanPham, TenSanPham, DonGia, SoLuong)
VALUES
(2, 9, N'Kệ tivi gỗ công nghiệp hiện đại', 3900000, 1),
(3, 11, N'Bàn làm việc có hộc kéo', 2800000, 1),
(4, 12, N'Ghế thư giãn đọc sách', 3300000, 1),
(5, 13, N'Gương trang trí viền gỗ', 1250000, 1),
(6, 14, N'Tủ giày thông minh 4 tầng', 2890000, 1),
(7, 10, N'Tủ bếp chữ L màu trắng', 15500000, 1);
GO

/* ============================================================
   11. INSERT THANH TOAN - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.ThanhToan
(MaDonHang, SoTien, PhuongThuc, TrangThai, MaGiaoDich, NgayThanhToan)
VALUES
(2, 3900000, N'THANH_TOAN_KHI_NHAN_HANG', N'DANG_CHO', NULL, NULL),
(3, 2830000, N'CHUYEN_KHOAN', N'THANH_CONG', N'CK202605270003', SYSDATETIME()),
(4, 3300000, N'MOMO', N'THANH_CONG', N'MOMO202605270004', SYSDATETIME()),
(5, 1280000, N'THANH_TOAN_KHI_NHAN_HANG', N'DANG_CHO', NULL, NULL),
(6, 2890000, N'VNPAY', N'THANH_CONG', N'VNPAY202605270006', SYSDATETIME()),
(7, 15500000, N'CHUYEN_KHOAN', N'THANH_CONG', N'CK202605270007', SYSDATETIME());
GO

/* ============================================================
   12. INSERT DANH GIA SAN PHAM - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.DanhGiaSanPham
(MaNguoiDung, MaSanPham, SoSao, NoiDung, TrangThai)
VALUES
(4, 9, 5, N'Kệ tivi chắc chắn, màu đẹp.', N'DA_DUYET'),
(5, 11, 4, N'Bàn làm việc đẹp, đóng gói kỹ.', N'DA_DUYET'),
(6, 12, 5, N'Ghế rất êm, ngồi đọc sách thoải mái.', N'DA_DUYET'),
(7, 13, 4, N'Gương đẹp, hợp trang trí phòng khách.', N'DA_DUYET'),
(4, 14, 5, N'Tủ giày tiện, tiết kiệm diện tích.', N'DA_DUYET'),
(5, 10, 5, N'Tủ bếp đẹp, đúng phong cách hiện đại.', N'CHO_DUYET');
GO

/* ============================================================
   13. INSERT SAN PHAM YEU THICH - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.SanPhamYeuThich
(MaNguoiDung, MaSanPham)
VALUES
(4, 9),
(4, 12),
(5, 10),
(5, 11),
(6, 13),
(7, 14);
GO

/* ============================================================
   14. INSERT LICH HEN SHOWROOM - THEM 6 DONG
   ============================================================ */

INSERT INTO dbo.LichHenShowroom
(MaNguoiDung, HoTen, SoDienThoai, Email, NgayHen, GioHen, GhiChu, TrangThai)
VALUES
(4, N'Trần Minh Quân', N'0901111111', N'quan@gmail.com', DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), '08:30', N'Xem sofa và kệ tivi', N'CHO_XAC_NHAN'),
(5, N'Lê Thị Hồng', N'0902222222', N'hong@gmail.com', DATEADD(DAY, 4, CAST(GETDATE() AS DATE)), '14:00', N'Xem tủ bếp mẫu', N'DA_XAC_NHAN'),
(6, N'Phạm Gia Bảo', N'0903333333', N'bao@gmail.com', DATEADD(DAY, 5, CAST(GETDATE() AS DATE)), '10:00', N'Tư vấn phòng làm việc', N'CHO_XAC_NHAN'),
(7, N'Nguyễn Ngọc Anh', N'0904444444', N'anh@gmail.com', DATEADD(DAY, 6, CAST(GETDATE() AS DATE)), '15:30', N'Xem decor phòng khách', N'CHO_XAC_NHAN'),
(4, N'Trần Minh Quân', N'0901111111', N'quan@gmail.com', DATEADD(DAY, 8, CAST(GETDATE() AS DATE)), '09:00', N'Tư vấn combo phòng khách', N'DA_XAC_NHAN'),
(5, N'Lê Thị Hồng', N'0902222222', N'hong@gmail.com', DATEADD(DAY, 10, CAST(GETDATE() AS DATE)), '16:00', N'Xem bàn ăn Bắc Âu', N'CHO_XAC_NHAN');
GO

/* ============================================================
   15. KIEM TRA SO LUONG DU LIEU
   ============================================================ */

SELECT N'NguoiDung' AS TenBang, COUNT(*) AS SoDong FROM dbo.NguoiDung
UNION ALL SELECT N'DanhMuc', COUNT(*) FROM dbo.DanhMuc
UNION ALL SELECT N'PhongCach', COUNT(*) FROM dbo.PhongCach
UNION ALL SELECT N'Phong', COUNT(*) FROM dbo.Phong
UNION ALL SELECT N'SanPham', COUNT(*) FROM dbo.SanPham
UNION ALL SELECT N'DonHang', COUNT(*) FROM dbo.DonHang
UNION ALL SELECT N'ChiTietDonHang', COUNT(*) FROM dbo.ChiTietDonHang
UNION ALL SELECT N'DanhGiaSanPham', COUNT(*) FROM dbo.DanhGiaSanPham;
GO
