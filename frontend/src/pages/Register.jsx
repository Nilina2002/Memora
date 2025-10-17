import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(form.name, form.email, form.password);
        alert("Registered successfully!");
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col w-80 gap-2">
                <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button className="bg-purple-600 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
