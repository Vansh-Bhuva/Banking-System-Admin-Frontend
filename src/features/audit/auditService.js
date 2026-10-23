import api from "../../services/api/axios";

const fetch = async (service, { actor = "", action = "", page = 0, size = 20 } = {}) => {
  const params = { page, size };
  if (actor) params.actor = actor;
  if (action) params.action = action;

  const paths = {
    auth: "/api/v1/admin/users/audit",
    account: "/api/v1/admin/accounts/audit",
    transaction: "/api/v1/admin/transactions/audit",
  };

  const res = await api.get(paths[service], { params });
  return res.data;
};

export default { fetch };