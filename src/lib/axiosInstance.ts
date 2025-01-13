import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

export const axiosInstance = axios.create({
  // URL untuk lingkungan development
  baseURL: isProduction
    ? "https://clerk-wine.vercel.app/api"
    : "http://localhost:3000/api",
  withCredentials: true,
});
