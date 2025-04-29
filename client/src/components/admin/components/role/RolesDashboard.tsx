import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteRole, getRoles } from "../../../../services/roleApi";
import { ErrorResponse } from "../../../../types/error";
import { Role } from "../../../../types/role";
import Sidebar from "../../../shared/SideNavBar";
import CreateRoleModal from "./CreateRoleModal";
import { LoadingState } from "../LoadingState";
import RoleItem from "./RoleItem";

export default function RolesDashboard() {
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  // const openCreateRoleModal = () => setIsCreateRoleModalOpen(true);
  const closeCreaeRoleModal = () => {
    setIsCreateRoleModalOpen(false);
    refetch();
  };

  const {
    data: roles,
    isLoading,
    refetch,
    error: rolesFetchError,
  } = useQuery<Role[], AxiosError<ErrorResponse>>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success("Role deleted successfully!");
      refetch();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
      console.error("Error deleting role:", error);
    },
  });

  if (!isLoading && rolesFetchError) {
    toast.error(
      "Failed to load roles." + rolesFetchError.response?.data?.message
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto animate-slideIn  ">
          <div className="flex justify-between">
            <div className="flex">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Roles
              </h1>
            </div>
            <div className="flex">
              <button
                onClick={() => {
                  toast.info("Role creation feature will be avaiable soon.", {
                    position: "top-right",
                  });
                  // openCreateRoleModal();
                }}
                className="mb-4 px-4 py-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Create Role
              </button>
            </div>
          </div>
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid gap-4">
              {roles?.map((role) => (
                <RoleItem
                  key={role._id}
                  role={role}
                  onDelete={() => deleteRoleMutation.mutate(role._id)}
                  onRefresh={refetch}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isCreateRoleModalOpen && (
        <CreateRoleModal onClose={closeCreaeRoleModal} />
      )}
    </div>
  );
}
