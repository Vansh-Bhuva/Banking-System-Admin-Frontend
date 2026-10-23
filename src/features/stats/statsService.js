import api from "../../services/api/axios";

const fetchAll = async () => {
  const [users, accounts, transactions, fraud] = await Promise.all([
    api.get("/api/v1/admin/stats/users"),
    api.get("/api/v1/admin/stats/accounts"),
    api.get("/api/v1/admin/stats/transactions"),
    api.get("/api/v1/admin/stats/fraud"),
  ]);

  return {
    users: users.data,
    accounts: accounts.data,
    transactions: transactions.data,
    fraud: fraud.data,
  };
};

export default { fetchAll };