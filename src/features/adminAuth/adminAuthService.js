import api from "../../services/api/axios";

const login = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  const data = response.data;

  if (!data?.token) throw new Error("No token returned by server");

  const payload = JSON.parse(atob(data.token.split(".")[1]));
  if (payload.role !== "ADMIN") {
    throw new Error("This account does not have admin access");
  }

  const stored = { ...data, role: payload.role, email: payload.sub };
  localStorage.setItem("adminAuth", JSON.stringify(stored));
  return stored;
};

const logout = () => localStorage.removeItem("adminAuth");

const getStored = () => JSON.parse(localStorage.getItem("adminAuth"));

export default { login, logout, getStored };