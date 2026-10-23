import api from "../../services/api/axios";

const list = async ({ status = "", severity = "", page = 0, size = 20 } = {}) => {
  const params = { page, size };
  if (status) params.status = status;
  if (severity) params.severity = severity;
  const res = await api.get("/api/v1/admin/fraud/alerts", { params });
  return res.data;
};

const dismiss = async (id, notes = "") =>
  (await api.put(`/api/v1/admin/fraud/alerts/${id}/dismiss`, null, { params: { notes } })).data;

const markAction = async (id, notes = "") =>
  (await api.put(`/api/v1/admin/fraud/alerts/${id}/action`, null, { params: { notes } })).data;

export default { list, dismiss, markAction };