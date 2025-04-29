import { useState, useEffect } from "react";
import { Permission, Role } from "../../../../types/role";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateRolePermissions } from "../../../../services/roleApi";
import { ErrorResponse } from "../../../../types/error";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getPermissions } from "../../../../services/permissionApi";

export function AssignPermissions({
  role,
  onClose,
  onRefresh,
}: {
  role: Role;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    role.permissions
  );

  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  // Used to compare original permissions
  const [initialPermissionIds, setInitialPermissionIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    setInitialPermissionIds(role.permissions.map((p) => p._id));
  }, [role.permissions]);

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.map((p) => p._id).includes(permission._id)
        ? prev.filter((p) => p._id !== permission._id)
        : [...prev, permission]
    );
  };

  const updateRolePermissionsMutation = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      toast.success("Role permissions updated successfully!");
      onRefresh();
      onClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
      console.error("Error updating role permissions:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRolePermissionsMutation.mutate({
      _id: role._id,
      permissions: selectedPermissions,
    });
  };

  // Helper to check if selected permissions changed
  const isSubmitDisabled = () => {
    const selectedIds = selectedPermissions.map((p) => p._id).sort();
    const initialIds = initialPermissionIds.sort();
    return JSON.stringify(selectedIds) === JSON.stringify(initialIds);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition
            all sm:w-full sm:max-w-lg animate-slideUp"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{role.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>

                {permissions
                  ?.filter(
                    (permission) => permission.name !== "master:permission"
                  )
                  .map((permission) => (
                    <div
                      key={permission._id}
                      className="flex items-center mb-2"
                    >
                      <input
                        type="checkbox"
                        id={permission._id}
                        checked={selectedPermissions
                          .map((p) => p._id)
                          .includes(permission._id)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="mr-2"
                      />
                      <label htmlFor={permission._id} className="text-sm">
                        {permission.name}
                      </label>
                    </div>
                  ))}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                disabled={isSubmitDisabled()}
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
