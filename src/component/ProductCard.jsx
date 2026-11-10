import { useNavigate } from "react-router";
import { useState } from "react";

const ProductCard = ({
  product,
  onAddToCart,
  cart,
  removeFromCart,
  updateQuantity,
}) => {
  const { _id, title, price, description, category, image, rating } = product;
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/products/${_id}`);
  };

  const cartItem = cart.find((item) => item._id === _id);

  return (
    <div className=" flex flex-col gap-3 h-[450x] bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
      <div
        onClick={() => handleCardClick()}
        className="w-full flex justify-center"
      >
        <img className="h-48 object-cover" src={image} alt={title} />
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex items-center">
          <span className="text-yellow-500">{rating? rating.rate: ''}</span>
          <span className="ml-2 text-gray-600">({rating? rating.count : "Not rated"})</span>
        </div>
        <div className="">{category}</div>
      </div>

      <div className="">
        <h2 className="text-xl font-bold line-clamp-2">{title}</h2>
        <p className="text-gray-600 line-clamp-3">{description}</p>
      </div>
      <div className="mt-auto">
        <p className="text-xl font-bold">${price}</p>
        {cartItem ? (
          <div className="w-full flex gap-3 justify-center">
            <button className="border text-xl p-1 px-3 border-slate-300 w-full cursor-pointer rounded-sm"
              onClick={() => {
                updateQuantity(_id, -1);
                event.stopPropagation();
              }}
            >
              -
            </button>
            <span className="text-xl">{cartItem.quantity}</span>
            <button className="border text-xl p-1 px-3 border-slate-300 w-full cursor-pointer rounded-sm"
              onClick={() => {
                updateQuantity(_id, 1);
                event.stopPropagation();
              }}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="mt-3 py-2 w-full bg-blue-500 text-white rounded"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart();
            }}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
