import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminOrTeacherRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Checking permissions...</div>;
  }

  return user?.role === "admin" || user?.role === "teacher" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default AdminOrTeacherRoute;
