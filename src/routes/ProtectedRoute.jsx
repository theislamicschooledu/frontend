import { Navigate, Outlet } from "react-router-dom";
import { FullPageLoading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center text-center py-10 h-screen text-xl font-semibold">
        <FullPageLoading />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
