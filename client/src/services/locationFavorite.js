import apiClient from "@/utils/api-client";

export const getAllFavorites = () => apiClient.get("favorite-location");
export const createFavorite = (data) =>
  apiClient.post("favorite-location", data);
