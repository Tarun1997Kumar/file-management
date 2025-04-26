import { JSX } from "react";
import { useNavigate } from "react-router-dom";

export const NavItem = ({
  path,
  label,
  icon,
  isActive,
}: {
  path: string;
  label: string;
  icon: JSX.Element;
  isActive: (path: string) => boolean;
}) => {
  const navigate = useNavigate();
  return (
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
};
