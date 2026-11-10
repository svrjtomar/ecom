import mongoose from "mongoose";

const schema = mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    rating: {
        rate: Number,
        count: Number
    },
    stock: Number,
    status: String
   
});

const ProductModel = mongoose.model("products", schema);
export default ProductModel;