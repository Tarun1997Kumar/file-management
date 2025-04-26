import { useMutation } from "@tanstack/react-query";
import { updateUserRole } from "../../../services/userApi";
import { RoleDropDownProps } from "../types/RoleDropDownProps";
import { toast } from "react-toastify";

export function RoleDropdown(props: RoleDropDownProps) {
  const updateRoleMutation = useMutation({
    mutationFn: (props: { userId: string; roleId: string }) =>
      updateUserRole(props.userId, props.roleId),
    onSuccess: () => {
      toast.success("Previlages updated successfully!");
      props.onRefresh?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to update previlages!");
      console.error("Error updating role:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = e.target.value;
    updateRoleMutation.mutate({ userId: props.userId, roleId });
  };

  return (
    <select
      value={props.currentRole._id}
      onChange={handleChange}
      disabled={
        props.currentRole.name == "master-admin" || updateRoleMutation.isPending
      }
      className="border rounded px-2 py-1 text-sm"
    >
      {props.roles?.map((role) => (
        <option key={role._id} value={role._id}>
          {role.name}
        </option>
      ))}
      ;
    </select>
  );
}
