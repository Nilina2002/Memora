import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import React from 'react'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notes" element={<Protected><Notes /></Protected>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

const Protected = ({ children }) => {
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!user && !token) return <Navigate to="/" replace />;
  return children;
};
