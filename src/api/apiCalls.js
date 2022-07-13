import axios from "axios";

export const activate = (token) => {
  return axios.post("/api/1.0/users/token/" + token);
};

export const loadUsers = (page) => {
  return axios.get("/api/1.0/users", { params: { page, size: 3 } });
};

export const getUserById = (id) => {
  return axios.get(`/api/1.0/users/${id}`);
};

export const login = (body) => {
  return axios.post("/api/1.0/auth", body);
};
