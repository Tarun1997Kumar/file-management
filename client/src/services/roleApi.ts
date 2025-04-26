import api from "./api";
import { Role } from "../types/role";

export const getRoles = async () => {
  const response = api.get<Role[]>("/admin/roles");
  const roles = (await response).data;
  return roles;
};

export const createRole = async (role: Role) => {
  const response = await api.post("/admin/roles", role);
  return response.data;
};

export const updateRolePermissions = async (role: Role) => {
  const response = await api.put(`/admin/roles/${role._id}/permissions`, {
    permissions: role.permissions,
  });
  return response.data;
};

export const deleteRole = async (roleId: string | undefined) => {
  const response = await api.delete(`/admin/roles/${roleId}`);
  return response.data;
};
