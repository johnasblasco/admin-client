import { Navigate } from "react-router-dom";

export default function Login() {
    const handleLogin = () => {
        localStorage.setItem("user", JSON.stringify({ role: "admin" }));
        <Navigate to="/" />;
    };

    return (
        <div className="p-6">
            <button
                onClick={handleLogin}
                className="px-4 py-2 bg-black text-white rounded"
            >
                Login
            </button>
        </div>
    );
}
