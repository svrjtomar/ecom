import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router";
import { fetchProductsById } from "../api/productApi";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const { addToCart } = useOutletContext();
  const { id } = useParams();
  useEffect(() => {
    
      const getProduct = async () => {
        try {
        const data = await fetchProductsById(id);
        setProduct(data);
      }

     catch (error) {
      console.log(error);
    }
}

    getProduct();
  }, [id]);
const {image, title, description, price,category, rating={}} = product;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
<div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center">
<img
src={image}
alt={title}
className="h-96 object-contain"
/>
</div>

<div className="flex flex-col">
<span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full w-fit mb-3">
{category}
</span>

<h1 className="text-3xl font-bold text-gray-900 mb-4">
{title}
</h1>

<div className="flex items-center gap-3 mb-4">
<span className="text-yellow-500 font-semibold">
⭐ {rating.rate}
</span>
<span className="text-gray-500">
({rating.count} reviews)
</span>
</div>

<p className="text-gray-700 leading-relaxed mb-6">
{description}
</p>

<div className="mb-6">
<span className="text-4xl font-bold text-green-600">
${price}
</span>
</div>
<div className="flex gap-4">
<button
  type="button"
  onClick={() => addToCart(product)}
  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
>
Add to Cart
</button>

<button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
Buy Now
</button>
</div>
</div>
</div>
</div>
  );
};

export default ProductDetails;
