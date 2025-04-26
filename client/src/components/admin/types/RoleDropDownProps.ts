import { Role } from "../../../types/role";

export interface RoleDropDownProps {
  userId: string;
  currentRole: Role;
  roles?: Role[];
  onRefresh?: () => void;
}
