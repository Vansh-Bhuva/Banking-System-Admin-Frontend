import api from "../../services/api/axios";

const list = async (filters = {}) => {
  const params = {};
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.status) params.status = filters.status;
  if (filters.minAmount) params.minAmount = filters.minAmount;
  if (filters.maxAmount) params.maxAmount = filters.maxAmount;
  if (filters.accountNumber) params.accountNumber = filters.accountNumber;
  params.page = filters.page ?? 0;
  params.size = filters.size ?? 20;

  const res = await api.get("/api/v1/admin/transactions", { params });
  return res.data;
};

const get = async (id) => (await api.get(`/api/v1/admin/transactions/${id}`)).data;

const reverse = async (id, reason) =>
  (await api.post(`/api/v1/admin/transactions/${id}/reverse`, null, { params: { reason } })).data;

export default { list, get, reverse };