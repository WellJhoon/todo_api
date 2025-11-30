export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";
export const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : "http://127.0.0.1:8000";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};
