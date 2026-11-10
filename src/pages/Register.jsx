import { NavLink } from "react-router";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    delete data.confirmPassword;
    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/auth/register", data);
      navigate("/login");
    } catch (error) {
      const validationMessage = error.response?.data?.errors
        ?.map((item) => item.msg)
        .filter(Boolean)
        .join(" ");
      setErrorMessage(
        validationMessage ||
          error.response?.data?.message ||
          "Unable to create your account. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white border-slate-100 rounded-lg shadow-sm h-100 w-100 p-8">
        <h1 className="text-2xl font-bold flex justify-center">Register</h1>
        <form onSubmit={handleSubmit} className="">
          <div className="space-y-5 w-full mt-8">
            <input
              type="text"
              name="name"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Enter your Name"
              autoComplete="name"
              required
            />
            <input
              type="email"
              name="email"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Enter your Email"
              autoComplete="email"
              required
            />
            <input
              type="password"
              name="password"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Set a Password"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Enter your Password again"
              autoComplete="new-password"
              minLength={6}
              required
            />

            {errorMessage && (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0016DF] text-white rounded-sm p-2 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Continue"}
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center mt-8">
          <p>
            Already have an account?{" "}
            <span className="text-violet-900 font-semibold">
              <NavLink to={"/login"}>Login</NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
