import { useRoutes } from "react-router-dom";
import Login from "@/auth/Login";
import ProtectedRoute from "./protected";

import MainLayout from "@/layout/MainLayout";
import AdminLayout from "@/layout/AdminLayout";
import ClientLayout from "@/layout/ClientLayout";

import { adminRoutes } from "./admin.routes";
import { clientRoutes } from "./client.routes";

export default function AppRoutes() {
    const routes = useRoutes([
        { path: "/login", element: <Login /> },

        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <MainLayout />  {/* shared shell DATA and Everyting across admin and client */}
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "admin",
                    element: <AdminLayout />,
                    children: adminRoutes,
                },
                {
                    path: "client",
                    element: <ClientLayout />,
                    children: clientRoutes,
                },
            ],
        },
    ]);

    return routes;
}
