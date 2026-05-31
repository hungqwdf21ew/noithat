const CollectionModel = require('../models/collection.model');

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

exports.getAll = async () => {
  const data = await CollectionModel.findAll();
  return {
    success: true,
    data: data.map(c => ({
      id: c.MaBoSuuTap,
      title: c.TenBoSuuTap,
      slug: c.DuongDan,
      desc: c.MoTa,
      img: c.HinhAnh,
      status: c.TrangThai,
      tag: 'Hiện đại' // Default tag for UI compatibility
    }))
  };
};

exports.getById = async (id) => {
  const c = await CollectionModel.findById(id);
  if (!c) return { success: false, message: 'Không tìm thấy bộ sưu tập.' };
  return {
    success: true,
    data: {
      id: c.MaBoSuuTap,
      title: c.TenBoSuuTap,
      slug: c.DuongDan,
      desc: c.MoTa,
      img: c.HinhAnh,
      status: c.TrangThai,
      tag: 'Hiện đại'
    }
  };
};

exports.create = async (data) => {
  if (!data.title) return { success: false, message: 'Vui lòng nhập tên bộ sưu tập.' };
  
  const payload = {
    tenBoSuuTap: data.title,
    duongDan: slugify(data.title),
    moTa: data.desc || '',
    hinhAnh: data.img || '',
    trangThai: data.status || 'HOAT_DONG'
  };

  const newCol = await CollectionModel.create(payload);
  return { success: true, message: 'Thêm bộ sưu tập thành công', data: newCol };
};

exports.update = async (id, data) => {
  if (!data.title) return { success: false, message: 'Vui lòng nhập tên bộ sưu tập.' };

  const payload = {
    tenBoSuuTap: data.title,
    duongDan: slugify(data.title),
    moTa: data.desc || '',
    hinhAnh: data.img || '',
    trangThai: data.status || 'HOAT_DONG'
  };

  const updatedCol = await CollectionModel.update(id, payload);
  if (!updatedCol) return { success: false, message: 'Không tìm thấy bộ sưu tập để cập nhật.' };

  return { success: true, message: 'Cập nhật thành công', data: updatedCol };
};

exports.delete = async (id) => {
  const ok = await CollectionModel.delete(id);
  if (!ok) return { success: false, message: 'Không thể xóa bộ sưu tập.' };
  return { success: true, message: 'Xóa thành công' };
};
