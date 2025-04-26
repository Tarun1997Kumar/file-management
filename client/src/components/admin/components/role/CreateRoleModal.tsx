import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Permission } from "../../../../types/role";
import { getPermissions } from "../../../../services/permissionApi";
import { createRole } from "../../../../services/roleApi";
import { toast } from "react-toastify";
import { ErrorResponse } from "../../../../types/error";
import { AxiosError } from "axios";

// create role modal with list of permissions and a name field
export default function CreateRoleModal({ onClose }: { onClose: () => void }) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );

  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  const createRoleMutation = useMutation({
    mutationFn: async () => {
      await createRole({ name: roleName, permissions: selectedPermissions });
    },
    onSuccess: () => {
      toast.success("Role created successfully!");
      onClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error("Failed to create role.");
      console.error("Error creating role:", error);
    },
  });

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.map((p) => p._id).includes(permissionId)
        ? prev.filter((p) => p._id !== permissionId)
        : [
            ...prev,
            permissions?.find((p) => p._id === permissionId) || {
              _id: permissionId,
              name: "",
              description: "",
            },
          ]
    );
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
            <h2 className="text-lg font-semibold mb-4">Create Role</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createRoleMutation.mutate();
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
                {permissions?.map((permission) => (
                  <div key={permission._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={permission._id}
                      checked={selectedPermissions
                        .map((p) => p._id)
                        .includes(permission._id)}
                      onChange={() => handlePermissionToggle(permission._id)}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Create Role
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
