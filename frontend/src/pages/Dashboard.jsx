import { useEffect, useState } from "react";
import { api, setToken } from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TAskCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setToken(token);

    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to fetch tasks"));
  }, [navigate]);

  const handleNewTask = (task) => {
    setTasks((prev) => [task, ...prev]);
     toast.success("Task added successfully and email sent ✅");
  };

  const handleTaskDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    toast.success("Task deleted successfully 🗑️");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-6 font-quicksand">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-2 px-4 rounded-lg font-semibold shadow-lg hover:opacity-90 active:scale-95 transition duration-200 cursor-pointer"
        >
          Logout
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          AI Task Manager 📋
        </h1>

        <div className="mb-10">
          <TaskForm onNewTask={handleNewTask} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDeleted={handleTaskDeleted} />
          ))}
        </div>
      </div>
    </div>
  );
}