import apiClient from "../utils/api-client";

export const getRides = (pageNumber, pageSize, search = "") =>
  apiClient.get(
    `ride?Page=${pageNumber}&PageSize=${pageSize}&Search=${search}`
  );
export const createRide = (data) => apiClient.post("ride", data);
export const getProgramados = () => apiClient.get("ride");
export const createPrice = (data) =>
  apiClient.post("ride/calculate-price", data);
export const deleteRide = (id) => apiClient.delete(`ride/${id}/cancel`);
export const editRide = (id, scheduledAt) =>
  apiClient.patch(`ride/${id}`, scheduledAt);
export const ratingDriver = (id, rating) =>
  apiClient.post(`ride/${id}/rate`, rating);
export const getInProgress = () => apiClient.get("ride/inprogress");
