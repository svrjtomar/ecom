import { NavLink } from "react-router";
import axionsInstace from '../api/axiosInstance'
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await axionsInstace.post("/api/auth/register", data)
      console.log(response.data)
      navigate('/login')

    } catch (error) {
          console.error(error.response?.data ?? error.message);

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
            />
            <input
              type="email"
              name="email"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Enter your Email"
            />
            <input
              type="password"
              name="password"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Set a Password"
            />
            <input
              type="password"
              name="confirmPassword"
              className="w-full border border-slate-100 rounded-sm px-3 py-2"
              placeholder="Enter your Password again"
            />

            <button
              type="submit"
              className="w-full bg-[#0016DF] text-white rounded-sm p-2 font-semibold cursor-pointer"
            >
              Continue
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

export default Login;
