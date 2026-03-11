import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({ onSubmit, isLogin, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      setFormError("Please fill all fields");
      return;
    }

    setFormError(null);
    onSubmit({ name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">
            {isLogin ? "Welcome Back 👋" : "Create Account 😎"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Login to continue" : "Register to start your journey"}
          </p>
        </div>

        {!isLogin && (
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 active:scale-95 transition duration-200 cursor-pointer"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {formError && (
          <p className="text-red-500 text-sm text-center font-medium">
            {formError}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <p className="text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}