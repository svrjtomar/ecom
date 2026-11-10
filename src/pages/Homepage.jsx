import { useState, useEffect } from "react";
import ProductCard from "../component/ProductCard";
import fetchProducts from "../api/productApi";
import { useOutletContext } from "react-router";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, removeFromCart, updateQuantity, cart } = useOutletContext();

  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
           setProducts(data)
        setIsLoading(false);
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    };

    loadProducts();
  }, []);

  if(isLoading) {
    return <div className="relative flex justify-center items-center inset-0 bg-slate-100">
      <div className="h-20 w-20 rounded-full border-2 border-gray-400 border-t-blue-600 animate-spin "></div>
    </div>
  }

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="text-center bg-slate-200 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to Ecom</h1>
        <p className="text-lg text-gray-700">
          Your one-stop shop for all your needs.
        </p>
        <div className="flex justify-center mt-8">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg mr-4 hover:bg-blue-600 transition duration-300">
            Shop Now
          </button>
          <button className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-300">
            Learn More
          </button>
        </div>
      </div>

      <div className="mt-5 px-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:grid-cols-4">
          {
            products.map((product)=> {
              
              return (
                <ProductCard
                  key={product._id ?? product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  cart={cart}


                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Homepage;
