import apiClient from "../utils/api-client";

export const getRides = () => apiClient.get("ride");
export const createRide = (data) => apiClient.post("ride", data);
export const deleteRide = (id) => apiClient.delete(`ride/${id}`);
export const editRide = (id, data) => apiClient.put(`ride/${id}`, data);
