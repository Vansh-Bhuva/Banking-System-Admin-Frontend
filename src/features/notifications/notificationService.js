import api from "../../services/api/axios";

const history = async ({ userId = "", page = 0, size = 20 } = {}) => {
  const params = { page, size };
  if (userId) params.userId = userId;
  const res = await api.get("/api/v1/admin/notifications", { params });
  return res.data;
};

const broadcast = async ({ title, message, userIds }) => {
  const res = await api.post("/api/v1/admin/notifications/broadcast", {
    title,
    message,
    userIds,
  });
  return res.data;
};

export default { history, broadcast };