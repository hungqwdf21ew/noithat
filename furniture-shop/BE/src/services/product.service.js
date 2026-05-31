const ProductModel = require('../models/product.model');

// Custom Slug Generator for Vietnamese strings
const slugify = (str) => {
  if (!str) return '';
  let res = str.toLowerCase();
  res = res.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  res = res.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  res = res.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  res = res.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  res = res.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  res = res.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  res = res.replace(/đ/g, 'd');
  res = res.replace(/[^a-z0-9\s-]/g, '');
  res = res.replace(/[\s_]+/g, '-');
  res = res.replace(/-+/g, '-');
  return res.trim().replace(/^-+|-+$/g, '');
};

exports.getAllProducts = async () => {
  const products = await ProductModel.findAll();
  const categories = await ProductModel.findAllCategories();

  return {
    success: true,
    data: {
      products: products.map(p => ({
        id: p.MaSanPham,
        categoryId: p.MaDanhMuc,
        category: p.TenDanhMuc,
        name: p.TenSanPham,
        slug: p.DuongDan,
        sku: p.MaSKU,
        description: p.MoTa,
        price: Number(p.GiaBan),
        salePrice: p.GiaKhuyenMai ? Number(p.GiaKhuyenMai) : null,
        stock: p.SoLuongTon,
        material: p.ChatLieu,
        color: p.MauSac,
        size: p.KichThuoc,
        image: p.HinhAnhChinh,
        status: p.TrangThai === 'HOAT_DONG' ? 'ACTIVE' : (p.TrangThai === 'AN' ? 'HIDDEN' : 'OUT_OF_STOCK')
      })),
      categories: categories.map(c => ({
        id: c.MaDanhMuc,
        name: c.TenDanhMuc,
        slug: c.DuongDan
      }))
    }
  };
};

exports.getProductById = async (id) => {
  const p = await ProductModel.findById(id);
  if (!p) {
    return { success: false, message: 'Không tìm thấy sản phẩm.' };
  }
  return {
    success: true,
    data: {
      id: p.MaSanPham,
      categoryId: p.MaDanhMuc,
      category: p.TenDanhMuc,
      name: p.TenSanPham,
      slug: p.DuongDan,
      sku: p.MaSKU,
      description: p.MoTa,
      price: Number(p.GiaBan),
      salePrice: p.GiaKhuyenMai ? Number(p.GiaKhuyenMai) : null,
      stock: p.SoLuongTon,
      material: p.ChatLieu,
      color: p.MauSac,
      size: p.KichThuoc,
      image: p.HinhAnhChinh,
      status: p.TrangThai === 'HOAT_DONG' ? 'ACTIVE' : (p.TrangThai === 'AN' ? 'HIDDEN' : 'OUT_OF_STOCK')
    }
  };
};

exports.createProduct = async (data) => {
  const slug = slugify(data.name);
  const sku = data.sku || 'SP-' + Math.floor(Math.random() * 900000 + 100000);

  const payload = {
    maDanhMuc: data.categoryId,
    tenSanPham: data.name,
    duongDan: slug,
    maSKU: sku,
    moTa: data.description,
    giaBan: Number(data.price),
    giaKhuyenMai: data.salePrice ? Number(data.salePrice) : null,
    soLuongTon: Number(data.stock || 0),
    chatLieu: data.material,
    mauSac: data.color,
    kichThuoc: data.size,
    hinhAnhChinh: data.image,
    trangThai: data.status === 'HIDDEN' ? 'AN' : (data.status === 'OUT_OF_STOCK' ? 'HET_HANG' : 'HOAT_DONG')
  };

  if (!payload.maDanhMuc || !payload.tenSanPham || !payload.giaBan) {
    return { success: false, message: 'Vui lòng cung cấp đầy đủ tên sản phẩm, danh mục và đơn giá.' };
  }

  const newProd = await ProductModel.create(payload);

  return {
    success: true,
    message: 'Thêm sản phẩm thành công!',
    data: newProd
  };
};

exports.updateProduct = async (id, data) => {
  const slug = slugify(data.name);

  const payload = {
    maDanhMuc: data.categoryId,
    tenSanPham: data.name,
    duongDan: slug,
    maSKU: data.sku,
    moTa: data.description,
    giaBan: Number(data.price),
    giaKhuyenMai: data.salePrice ? Number(data.salePrice) : null,
    soLuongTon: Number(data.stock || 0),
    chatLieu: data.material,
    mauSac: data.color,
    kichThuoc: data.size,
    hinhAnhChinh: data.image,
    trangThai: data.status === 'HIDDEN' ? 'AN' : (data.status === 'OUT_OF_STOCK' ? 'HET_HANG' : 'HOAT_DONG')
  };

  if (!payload.maDanhMuc || !payload.tenSanPham || !payload.giaBan) {
    return { success: false, message: 'Vui lòng cung cấp đầy đủ tên sản phẩm, danh mục và đơn giá.' };
  }

  const updatedProd = await ProductModel.update(id, payload);
  if (!updatedProd) {
    return { success: false, message: 'Không tìm thấy sản phẩm để cập nhật.' };
  }

  return {
    success: true,
    message: 'Cập nhật sản phẩm thành công!',
    data: updatedProd
  };
};

exports.deleteProduct = async (id) => {
  const ok = await ProductModel.delete(id);
  if (!ok) {
    return { success: false, message: 'Không thể xóa sản phẩm, có thể sản phẩm không tồn tại.' };
  }

  return {
    success: true,
    message: 'Xóa sản phẩm thành công!'
  };
};
