import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../AuthContext";
import { FileItem } from "../../types/file";
import Sidebar from "../SideNavBar";

interface User {
  _id: string;
  email: string;
  role: { name: string };
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const isAdmin = useAdmin();

  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 grow">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <section className="mt-4">
          <h2 className="text-xl">Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.email} - {user.role.name}
                {/* Add Promote/Demote/Delete buttons */}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <h2 className="text-xl">Files</h2>
          <ul>
            {files.map((file) => (
              <li key={file._id}>{file.name}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
