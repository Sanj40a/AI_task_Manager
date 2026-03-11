import { useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function TaskForm({ onNewTask }) {
  const [title, setTitle] = useState("");
  const [aiText, setAiText] = useState("");
  const [priority, setPriority] = useState("low");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const createTask = async () => {
    if (!title) return toast.error("Please enter a task title");

    try {
      const res = await api.post("/tasks", { title, priority, deadline });
      onNewTask(res.data);
      setTitle("");
      setDeadline("");
      setPriority("low");
    
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  };

  const createAiTask = async () => {
    if (!aiText) return toast.error("Please enter AI task text");
    setLoading(true);

    try {
      const res = await api.post("/tasks/ai", { text: aiText });
      onNewTask(res.data);
      setAiText("");
    
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate AI task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl space-y-4 font-quicksand">
      <h2 className="text-xl font-bold text-gray-800">Add Task</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none transition"
      />

      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-[#667eea] focus:outline-none transition"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none transition"
        />
      </div>

      <button
        onClick={createTask}
        className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 active:scale-95 transition duration-200 cursor-pointer"
      >
        Add Task
      </button>

      <h2 className="text-xl font-bold text-gray-800 mt-4">Add AI Task</h2>

      <textarea
        placeholder="e.g. Finish my MERN project tomorrow at 6 PM"
        value={aiText}
        onChange={(e) => setAiText(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#667eea] focus:outline-none transition"
        rows={3}
      />

      <button
        onClick={createAiTask}
        disabled={loading}
        className="w-full bg-gradient-to-br from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 active:scale-95 transition duration-200 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Generating..." : "Generate AI Task"}
      </button>
    </div>
  );
}