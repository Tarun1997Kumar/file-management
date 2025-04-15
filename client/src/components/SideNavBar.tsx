import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { JSX } from "react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isActive = (path: string) => location.pathname.startsWith(path);

  const NavItem = ({
    path,
    label,
    icon,
  }: {
    path: string;
    label: string;
    icon: JSX.Element;
  }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
        isActive(path)
          ? "text-blue-600 bg-blue-50"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
      }`}
    >
      {icon}
      <span>{label}</span>
      {isActive(path) && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-200 animate-slideIn">
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          <NavItem
            path="/file-dashboard"
            label="My Files"
            icon={
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            }
          />
          {isAdmin && (
            <NavItem
              path="/admin"
              label="Admin Dashboard"
              icon={
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              }
            />
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 text-sm">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === "admin" ? "Administrator" : "User"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
