import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const MainLayout = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const productId = product._id ?? product.id;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => (item._id ?? item.id) === productId,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          (item._id ?? item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          (item._id ?? item.id) === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => (item._id ?? item.id) !== productId),
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
      />
      <main className="flex-1">
        <Outlet context={{ addToCart, updateQuantity, removeFromCart, cart }} />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
