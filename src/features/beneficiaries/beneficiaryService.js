import api from "../../services/api/axios";

const list = async (userId) => {
  const res = await api.get("/api/v1/admin/beneficiaries", {
    params: { userId },
  });
  return res.data;
};

const activate = async (id) =>
  (await api.put(`/api/v1/admin/beneficiaries/${id}/activate`)).data;

const block = async (id) =>
  (await api.put(`/api/v1/admin/beneficiaries/${id}/block`)).data;

export default { list, activate, block };