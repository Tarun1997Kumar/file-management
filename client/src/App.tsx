import { Navigate, Route, Routes } from "react-router-dom";
import { TopNavBar } from "./components/TopNavBar";
import { FileDashboard } from "./components/FileDashboard";
import { AuthProvider, useAdmin, useAuth } from "./components/AuthContext";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { JSX } from "react";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              user ? (
                <Navigate to="/file-dashboard" />
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
