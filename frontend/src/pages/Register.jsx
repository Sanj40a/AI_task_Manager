import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleRegister = async ({ name, email, password }) => {
    try {
      setError(null);

      await api.post("/auth/register", { name, email, password });
      toast.success("Registration successful 🎉");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return <AuthForm onSubmit={handleRegister} isLogin={false} error={error} />;
}
