import api from "../../services/api/axios";

const pending = async ({ page = 0, size = 20 } = {}) => {
  const res = await api.get("/api/v1/admin/kyc/pending", {
    params: { page, size },
  });
  return res.data;
};

const approve = async (userId) => {
  const res = await api.put(`/api/v1/admin/kyc/${userId}/approve`);
  return res.data;
};

const reject = async (userId, reason) => {
  const res = await api.put(`/api/v1/admin/kyc/${userId}/reject`, { reason });
  return res.data;
};

export default { pending, approve, reject };