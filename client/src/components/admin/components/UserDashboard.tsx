import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getUsers, updateUserActiveStatus } from "../../../services/userApi";
import { getRoles } from "../../../services/roleApi";
import { useAdmin } from "../../helper/AuthContext";
import Sidebar from "../../shared/SideNavBar";
import { RoleDropdown } from "./RoleDropdown";
import { LoadingState } from "./LoadingState";
import { ErrorPage } from "./ErrorPage";
import { toast } from "react-toastify";

export function UserDashboard() {
  const isAdmin = useAdmin();

  const {
    data: users,
    isLoading,
    error: userFetchError,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: roles, error: rolesFetchError } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const handleUpdateUser = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateUserActiveStatus(userId, isActive),
    onSuccess: () => {
      toast.success("User status updated successfully.");
      refetch();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error("Failed to update user status.");
      console.error("Error updating user status:", error);
    },
  });

  if (!isAdmin) return <Navigate to="/" />;

  if (userFetchError) {
    return <ErrorPage message="Failed to load users." />;
  }

  if (rolesFetchError) {
    toast.error("Failed to load roles.");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto animate-slideIn">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            User Management
          </h1>

          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid gap-4">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.email}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isAdmin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isAdmin ? user.role.name : "User"}
                      </span>

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-1 ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "active" : "inactive"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      {user.role.name !== "master-admin" && (
                        <>
                          <div className="flex items-center space-x">
                            <button
                              onClick={() =>
                                handleUpdateUser.mutate({
                                  userId: user._id,
                                  isActive: !user.isActive,
                                })
                              }
                              className={`px-2 py-1 rounded-md text-sm font-medium cursor-pointer ${
                                user.isActive
                                  ? "bg-red-100 text-red-800 hover:bg-red-700 hover:text-white"
                                  : "bg-green-100 text-green-800 hover:bg-green-700 hover:text-white"
                              }`}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>

                          <div className="flex items-center space-x-4">
                            <RoleDropdown
                              userId={user._id}
                              currentRole={user.role}
                              roles={roles?.filter(
                                (role) => role.name !== "master-admin"
                              )}
                              onRefresh={() => {
                                refetch();
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
