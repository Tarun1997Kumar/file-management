import api from "./api";
import { User } from "../types/user";

export const getUsers = async () => {
  const response = api.get<User[]>("/admin/users");
  const users = (await response).data;
  return users;
};

export const updateUserRole = async (userId: string, roleId: string) => {
  const response = await api.put(`/admin/users/${userId}/role`, { roleId });
  return response.data;
};

export const updateUserActiveStatus = async (
  userId: string,
  isActive: boolean
) => {
  const response = await api.put(`/admin/users/${userId}/status`, { isActive });
  return response.data;
};
