import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

export const axiosInstance = axios.create({
  baseURL: isProduction
    ? "https://clerk-wine.vercel.app/api" // URL untuk lingkungan production
    : "http://localhost:3000/api", // URL untuk lingkungan development
  withCredentials: true,
});
