import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const response = await axiosInstance.post("/api/auth/login", data);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to log in. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white border-slate-100 rounded-lg shadow-sm h-100 w-100 p-8">
        <h1 className="text-2xl font-bold flex justify-center">Login</h1>
        <form onSubmit={handleLogin} className="">
          <div className="space-y-5 w-full mt-8">
            <input
              type="email"
              name="email"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Email@example.com"
              autoComplete="email"
              required
            />
            <input
              type="password"
              name="password"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Password"
              autoComplete="current-password"
              required
            />
            {errorMessage && (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            )}
            <h1>Forgot Password?</h1>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0016DF] text-white rounded-sm p-2 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center mt-8">
          <p>
            Don't have account?{" "}
            <span className="text-violet-900 font-semibold">
              <NavLink to={"/register"}>Register</NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
