import { useAuth } from "./AuthContext";

export function TopNavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between bg-gray-100">
      <div className="p-4 grow-0">
        <h1 className="text-2xl">My Drive</h1>
      </div>
      <div className="p-4 mr-5">
        {user && (
          <button
            name="logout"
            id="logout"
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 disabled:bg-amber-400"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
