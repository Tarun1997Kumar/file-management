import { Navigate } from "react-router-dom";
import { useAdmin } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/api";
import Sidebar from "../SideNavBar";

function LoadingState() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 p-4 rounded-lg">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="mt-3 h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const isAdmin = useAdmin();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  if (!isAdmin) return <Navigate to="/" />;

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading users
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    Please try again later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
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
                      <p className="text-sm text-gray-500">Role: {user.role}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role === "admin" ? "Administrator" : "User"}
                      </span>
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
