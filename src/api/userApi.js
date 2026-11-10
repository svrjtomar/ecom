import axiosInstance from "./axiosInstance";

export const fetchUsers = async () => {
    const response = await axiosInstance('/api/auth/users')
    return response.data
};



export default fetchUsers;

