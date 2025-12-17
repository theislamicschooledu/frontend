import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const TeacherOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Checking permissions...</div>;
  }

  if(user?.role !== "teacher") {
    toast.error("Only teacher can access");
  }

  return user?.role === "teacher" ? <Outlet /> : <Navigate to="/" />;
};

export default TeacherOnlyRoute;
