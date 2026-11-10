import { NavLink, useNavigate } from "react-router";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const response = await axiosInstance.post("/api/auth/login", data);
    if (response.status === 200) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user))
      alert("user Logged in");
      navigate("/");
      console.log(response.data);
    } else {
      console.log(response.data);
      alert(error.response?.data?.message || "Invalid email/password");
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
            />
            <input
              type="password"
              name="password"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder=""
            />
            <h1>Forgot Password?</h1>
            <button className="w-full bg-[#0016DF] text-white rounded-sm p-2 font-semibold cursor-pointer">
              Continue
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
