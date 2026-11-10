import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "../Layouts/MainLayout.jsx";
import About from "../pages/About.jsx";
import Homepage from "../pages/Homepage.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import AdminApp from "../admin/AdminApp.jsx";
import ProtectedRoute from "../component/ProtectedRoute.jsx";
import Profile from "../pages/Profile.jsx";

export default function AppRoutes({ children }) {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: "/about",
          element: <About />,
        },

        {
          path: "/products/:id",
          element: <ProductDetails />,
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminApp />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router}>{children}</RouterProvider>;
}
