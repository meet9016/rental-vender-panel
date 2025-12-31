import api from "./api";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (payload: any) => {
  const res = await api.post("/users", payload);
  return res.data;
};
