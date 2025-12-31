import api from "./api";

export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};

export const updateSettings = async (payload: any) => {
  const res = await api.put("/settings", payload);
  return res.data;
};
