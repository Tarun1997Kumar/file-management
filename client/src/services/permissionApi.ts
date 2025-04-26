import api from "./api";
import { Permission } from "../types/role";

export const getPermissions = async () => {
  const response = api.get<Permission[]>("/admin/permissions");
  const permissions = (await response).data;
  return permissions;
};
