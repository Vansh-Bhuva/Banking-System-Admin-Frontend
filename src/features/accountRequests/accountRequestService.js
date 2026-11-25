import api from "../../services/api/axios";

const list = async ({ status = "PENDING", page = 0, size = 20 } = {}) =>
  (await api.get("/api/v1/admin/account-requests", { params: { status, page, size } })).data;

const approve = async (id) => (await api.put(`/api/v1/admin/account-requests/${id}/approve`)).data;

const reject = async (id, reason) =>
  (await api.put(`/api/v1/admin/account-requests/${id}/reject`, { reason })).data;

export default { list, approve, reject };