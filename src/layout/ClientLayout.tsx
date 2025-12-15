import { Outlet } from "react-router-dom";

export default function ClientLayout() {
    return (
        <div className="h-full">
            <header className="bg-green-600 p-4 text-white">
                Client Dashboard
            </header>

            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}
