import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getPermissions } from "../../../services/permissionApi";
import { useAdmin } from "../../helper/AuthContext";
import Sidebar from "../../shared/SideNavBar";

import { toast } from "react-toastify";
import { LoadingState } from "./LoadingState";

export default function PermissionsDashBoard() {
  const isAdmin = useAdmin();

  const {
    data: permissions,
    error: permFetchError,
    isLoading,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  if (!isAdmin) return <Navigate to="/" />;

  if (permFetchError) {
    toast.error("Failed to load roles.");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto animate-slideIn">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Permissions
          </h1>
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid gap-4">
              {permissions?.map((permission) => (
                <div
                  key={permission._id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {permission.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {permission.description}
                      </p>
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
