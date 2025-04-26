import { Role } from "./role";

export interface User {
  _id: string;
  email: string;
  role: Role;
  token?: string;
  isActive: boolean;
}
