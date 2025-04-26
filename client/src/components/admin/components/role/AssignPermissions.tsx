import { useState } from "react";
import { Permission, Role } from "../../../../types/role";
import { useMutation } from "@tanstack/react-query";
import { updateRolePermissions } from "../../../../services/roleApi";
import { ErrorResponse } from "../../../../types/error";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function AssignPermissions({
  role,
  onClose,
  onRefresh,
}: {
  role: Role;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    role.permissions
  );

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.map((p) => p._id).includes(permissionId)
        ? prev.filter((p) => p._id !== permissionId)
        : [
            ...prev,
            role.permissions?.find((p) => p._id === permissionId) || {
              _id: permissionId,
              name: "",
              description: "",
            },
          ]
    );
  };
  const updateRolePermissionsMutation = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      toast.success("Role permissions updated successfully!");
      onRefresh();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
      console.error("Error updating role permissions:", error);
    },
  });

  updateRolePermissionsMutation.mutate({
    _id: role._id,
    name: role.name,
    permissions: selectedPermissions,
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => onClose()}
        />
        <div
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition
            all sm:w-full sm:max-w-lg animate-slideUp"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Create Role</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                {role.permissions?.map((permission) => (
                  <div key={permission._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={permission._id}
                      checked={selectedPermissions
                        .map((p) => p._id)
                        .includes(permission._id)}
                      onChange={() => handlePermissionToggle(permission._id)}
                      className="mr-2"
                      disabled={selectedPermissions.length == 1 ? true : false}
                    />
                    <label htmlFor={permission._id} className="text-sm">
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Update Permissions
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
