import { Navigate, Route, Routes } from "react-router-dom";
import { TopNavBar } from "./components/TopNavBar";
import { FileDashboard } from "./components/user/FileDashboard.tsx";
import {
  AuthProvider,
  useAdmin,
  useAuth,
} from "./components/helper/AuthContext";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { JSX } from "react";
import { UserDashboard } from "./components/admin/components/UserDashboard.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RolesDashboard from "./components/admin/components/role/RolesDashboard.tsx";
import PermissionsDashBoard from "./components/admin/components/PermissionsDashBoard.tsx";

function ProtectedRouter({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  const isAdmin = useAdmin();
  return isAdmin ? children : <Navigate to="/" />;
}

function AppContent() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/file-dashboard/:parentId?"
            element={
              <ProtectedRouter>
                <FileDashboard />
              </ProtectedRouter>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <UserDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <AdminProtectedRoute>
                <RolesDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <AdminProtectedRoute>
                <PermissionsDashBoard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              user ? (
                user.role.name == "master-admin" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/file-dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
