import { useLocation } from "react-router-dom";
import { useAdmin, useAuth } from "../helper/AuthContext";
import { NavItem } from "./NavItem";
import {
  adminDashIcon,
  fileDashIcon,
  permissionIcon,
  rolesIcon,
} from "../helper/Icons";

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = useAdmin();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-200 animate-slideIn">
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {!isAdmin && (
            <NavItem
              isActive={isActive}
              path="/file-dashboard"
              label="My Files"
              icon={fileDashIcon}
            />
          )}
          {isAdmin && (
            <>
              <NavItem
                isActive={isActive}
                path="/admin"
                label="Users"
                icon={adminDashIcon}
              />
              <NavItem
                isActive={isActive}
                path="/roles"
                label="Roles"
                icon={rolesIcon}
              />
              <NavItem
                isActive={isActive}
                path="/permissions"
                label="Permissions"
                icon={permissionIcon}
              />
            </>
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
              {isAdmin ? "Administrator" : "User"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
