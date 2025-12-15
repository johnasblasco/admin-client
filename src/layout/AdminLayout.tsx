import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex h-full">
            <aside className="w-64 bg-blue-900 text-white p-4">
                <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
                <nav className="space-y-2">
                    <a href="/admin" className="block">Dashboard</a>
                    <a href="/admin/users" className="block">Users</a>
                </nav>
            </aside>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
