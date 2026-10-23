import api from "../../services/api/axios";

const list = async ({ search = "", page = 0, size = 20 }) => {
  const params = { page, size };
  if (search) params.search = search;
  const res = await api.get("/api/v1/admin/users", { params });
  return res.data; // { content, totalElements, totalPages, page }
};

const get = async (id) => {
  const res = await api.get(`/api/v1/admin/users/${id}`);
  return res.data;
};

const block = async (id) => {
  const res = await api.put(`/api/v1/admin/users/${id}/block`);
  return res.data;
};

const unblock = async (id) => {
  const res = await api.put(`/api/v1/admin/users/${id}/unblock`);
  return res.data;
};

export default { list, get, block, unblock };