import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex h-screen">
            <aside className="w-60 bg-gray-900 text-white p-4">
                <h2 className="text-lg font-semibold">Main Menu</h2>
            </aside>

            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
