import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await register(form.name, form.email, form.password);
            alert("Registered successfully!");
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-1">Create your account</h2>
                <p className="text-sm text-gray-600 mb-6">Start organizing your notes</p>
                {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Name</label>
                        <input
                            className="border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            className="border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="you@example.com"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            className="border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="••••••••"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <div className="text-xs text-gray-500">At least 8 characters is recommended.</div>
                    </div>
                    <button disabled={loading} className="bg-purple-600 disabled:opacity-60 text-white mt-2 py-2.5 rounded-lg">
                        {loading ? "Creating..." : "Create account"}
                    </button>
                </form>
                <div className="text-sm text-gray-600 mt-4">
                    Already have an account? <a href="/" className="text-purple-700 hover:underline">Log in</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
