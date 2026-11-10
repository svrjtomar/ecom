import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:3000" : ""),
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshRequest;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = /\/api\/auth\/(login|register|refresh-token|logout)(\?|$)/.test(
      originalRequest?.url ?? "",
    );

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest ||
      !localStorage.getItem("accessToken")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = axios
          .post(
            `${axiosInstance.defaults.baseURL}/api/auth/refresh-token`,
            {},
            { withCredentials: true },
          )
          .then(({ data }) => {
            if (!data.accessToken) {
              throw new Error("Refresh response did not include an access token");
            }
            localStorage.setItem("accessToken", data.accessToken);
            return data.accessToken;
          })
          .finally(() => {
            refreshRequest = null;
          });
      }

      const accessToken = await refreshRequest;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      if ([401, 403].includes(refreshError.response?.status)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.assign("/login");
        }
      }
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
