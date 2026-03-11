import { useState } from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function TaskCard({ task, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const priorityColor = {
    low: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  }[task.priority || "low"];

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (onDeleted) onDeleted(task._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-md bg-white flex justify-between items-center relative">
      <div>
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p className="text-gray-500 text-sm">
          Deadline:{" "}
          {task.deadline ? format(new Date(task.deadline), "PPP p") : "N/A"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColor}`}
        >
          {task.priority}
        </span>

        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-500 hover:text-red-700 cursor-pointer"
          title="Delete Task"
        >
          <FaTrash />
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-11/12 max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              Do you really want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
