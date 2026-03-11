import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { api, setToken } from "../services/api";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async ({ email, password }) => {
    try {
      setError(null);

      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      toast.success("Login successful 🎉");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return <AuthForm onSubmit={handleLogin} isLogin={true} error={error} />;
}
