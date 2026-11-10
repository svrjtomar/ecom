import { useNavigate } from "react-router";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-2xl font-bold mt-4">
            {user?.name}
          </h1>

          <p className="text-gray-500">
            {user?.email}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Name
            </p>
            <p className="font-medium">
              {user?.name}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Email
            </p>
            <p className="font-medium">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;