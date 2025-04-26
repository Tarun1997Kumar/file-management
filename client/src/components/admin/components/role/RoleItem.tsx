import { useState } from "react";
import { Role } from "../../../../types/role";
import { AssignPermissions } from "./AssignPermissions";
import { toast } from "react-toastify";

export default function RoleItem({
  role,
  onDelete,
  onRefresh,
}: {
  role: Role;
  onDelete: (roleId: string) => void;
  onRefresh: () => void;
}) {
  const [isAssignPermissionModalOpen, setIsAssignPermissionModalOpen] =
    useState(false);
  const closeAssignPermissionModal = () => {
    setIsAssignPermissionModalOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
            {role.permissions.length > 0 &&
              role.permissions.map((permission) => {
                return (
                  <>
                    <div
                      key={permission._id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ml-1`}
                    >
                      <span className="mr-2">{permission.name}</span>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
        {role.name !== "master-admin" && (
          <>
            <div
              key={role._id}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-black-800 hover:bg-gray-100 hover:text-gray-900 ml-1`}
            >
              <button
                onClick={() => {
                  // setIsAssignPermissionModalOpen(true)
                  toast.error("assigning permissions feature coming soon!");
                }}
                className="text-blue-500 hover:text-blue-700 cursor-pointer p-1 border-darker rounded-md"
                title="Assign permission"
                aria-label="Assign permission"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 00-1 1v6.586l-2.293-2.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 9.586V3a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onDelete}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200 cursor-pointer p-1 border-darker rounded-md"
                title="Delete role"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1a1 1 0 001 1h12a1 1 0 001-1V5a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm8.5 4h-7l-.5.5v.5h8V6.5l-.5-.5zM4.5 9h11l.5.5v7a2.5 2.5 0 01-2.5 2.5h-8A2.5 2.5 0 013.5 16V9.5l.5-.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {isAssignPermissionModalOpen && (
        <AssignPermissions
          role={role}
          onRefresh={onRefresh}
          onClose={() => setIsAssignPermissionModalOpen(false)}
        />
      )}
    </div>
  );
}
