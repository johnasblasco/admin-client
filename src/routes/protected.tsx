import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: any }) {
    const user = localStorage.getItem("user");

    if (!user) return <Navigate to="/login" replace />;

    return children || <Outlet />;
}
