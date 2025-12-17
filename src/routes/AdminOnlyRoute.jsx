import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const AdminOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Checking permissions...</div>;
  }

  if(user?.role !== "admin") {
    toast.error("Only admin can access");
  }

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminOnlyRoute;
