import apiClient from "../utils/api-client";

export const getVehicles = () => apiClient.get(`vehicle`);
export const getDriver = () => apiClient.get(`ride/scheduled-for-driver`);
export const acceptViaje = (id) => apiClient.post(`ride/${id}/accept`);
export const cancelViaje = (id) => apiClient.post(`ride/${id}/reject`);
