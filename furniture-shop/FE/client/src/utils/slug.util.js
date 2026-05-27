export const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^-\uFFFFa-z0-9-]/g, '')
    .replace(/-+/g, '-');
};
