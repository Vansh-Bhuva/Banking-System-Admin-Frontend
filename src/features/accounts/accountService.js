import api from "../../services/api/axios";

const list = async ({ search = "", status = "", page = 0, size = 20 } = {}) => {
  const params = { page, size };
  if (search) params.search = search;
  if (status) params.status = status;
  const res = await api.get("/api/v1/admin/accounts", { params });
  return res.data;
};

const get = async (accountNumber) => {
  const res = await api.get(`/api/v1/admin/accounts/${accountNumber}`);
  return res.data;
};

const freeze = async (accountNumber) =>
  (await api.put(`/api/v1/admin/accounts/${accountNumber}/freeze`)).data;

const unfreeze = async (accountNumber) =>
  (await api.put(`/api/v1/admin/accounts/${accountNumber}/unfreeze`)).data;

const markDormant = async (accountNumber) =>
  (await api.put(`/api/v1/admin/accounts/${accountNumber}/dormant`)).data;

export default { list, get, freeze, unfreeze, markDormant };