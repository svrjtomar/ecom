import { NavLink as Navlink } from "react-router";
import { CiShoppingCart } from "react-icons/ci";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Navbar = ({ cart, onUpdateQuantity, onRemoveFromCart }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <>
      <header className="flex justify-around items-center p-4 bg-gray-800 text-white">
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-bold">Ecom</h1>
        </div>
        <div className="flex-3">
          <ul className="flex justify-center gap-8">
            <Navlink to="/">Home</Navlink>
            <Navlink to="/about">About</Navlink>
           

            <Navlink to="/admin">Admin panel</Navlink>
          </ul>
        </div>
        
        <div className="flex-1 flex  gap-6 justify-end">
          <div className="flex">
           {user ? (
              <div className="relative group">
                <button className="cursor-pointer font-medium">
                  {"Hi "+user.name.split(" ")[0]}
                </button>

                <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Navlink
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Navlink>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Navlink to="/login">Login</Navlink>
            )}
        </div>
          <button
            type="button"
            className="relative cursor-pointer"
            aria-label={`Open cart, ${itemCount} items`}
            aria-expanded={isCartOpen}
            onClick={() => setIsCartOpen(true)}
          >
            <CiShoppingCart className="text-2xl" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-blue-500 px-1.5 text-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {
        <div
          className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-xl
transition-transform duration-500
ease-[cubic-bezier(0.22,1,0.36,1)]
${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={() => setIsCartOpen(false)}
        >
          <aside
            aria-label="Shopping cart"
            className={`fixed top-0 right-0 h-screen w-96 bg-white z-50
      transform transition-transform duration-300 ease-in-out
      ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold">Your Cart ({itemCount})</h2>
              <button
                type="button"
                className="text-4xl font-semibold cursor-pointer"
                aria-label="Close cart"
                onClick={() => setIsCartOpen(false)}
              >
                &times;
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="p-4 text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                <ul className="flex-1 divide-y overflow-y-auto">
                  {cart.map((item) => {
                    const productId = item._id ?? item.id;

                    return (
                      <li key={productId} className="flex gap-3 p-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-20 object-contain"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 font-medium">
                            {item.title}
                          </h3>
                          <p className="mt-1">
                            ${Number(item.price).toFixed(2)}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.title} quantity`}
                              onClick={() => onUpdateQuantity(productId, -1)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              aria-label={`Increase ${item.title} quantity`}
                              onClick={() => onUpdateQuantity(productId, 1)}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              className="ml-auto text-sm text-red-600"
                              onClick={() => onRemoveFromCart(productId)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t p-4">
                  <p className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      }
    </>
  );
};

export default Navbar;
