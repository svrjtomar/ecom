import axiosInstance from "./axiosInstance";

export const fetchProducts = async () => {
  const response = await axiosInstance.get("/api/products");

  return response.data;
};

export const fetchProductsById = async (id) => {
  const response = await axiosInstance.get(`api/products/${id}`);
  return response.data;
};

export const addNewProduct = async (data) => {
  const response = await axiosInstance.post("/api/products/", data);

  return response.data.product;
};

export const updateProduct = async (data) => {
  const response = await axiosInstance.put(`/api/products/${data._id}`, data);
  return response.data.product;
};

export const deleteProduct = async(id) => {
    const response  = await axiosInstance.delete(`api/products/${id}`);

    return response.data;
}

export default fetchProducts;
