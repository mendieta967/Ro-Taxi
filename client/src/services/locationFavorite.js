import apiClient from "@/utils/api-client";

export const getAllFavorites = () => apiClient.get("favorite-location");
export const createFavorite = (data) =>
  apiClient.post("favorite-location", data);
export const updateFavorite = (id, data) =>
  apiClient.put(`favorite-location/${id}`, data);
export const deleteFavorite = (id) =>
  apiClient.delete(`favorite-location/${id}`);
