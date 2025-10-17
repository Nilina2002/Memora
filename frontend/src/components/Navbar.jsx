import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch {
            // no-op UX
        }
    };

    return (
        <nav className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/notes" className="text-xl font-semibold text-purple-700">AiNoteTaker</Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="hidden sm:block text-sm text-gray-600">{user.name || user.email}</span>
                            <Link to="/notes" className="text-sm text-gray-700 hover:text-purple-700">Notes</Link>
                            <button onClick={handleLogout} className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="text-sm text-gray-700 hover:text-purple-700">Login</Link>
                            <Link to="/register" className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


