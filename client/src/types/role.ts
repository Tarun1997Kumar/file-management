export interface Role {
  _id?: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  _id: string;
  name: string;
  description: string;
}
