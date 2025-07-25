import apiClient from "../utils/api-client";

export const getVehicles = () => apiClient.get(`vehicle`);
export const getDriver = () => apiClient.get(`ride/scheduled-for-driver`);
export const acceptViaje = (id, vehicleId) =>
  apiClient.post(`ride/${id}/accept`, { vehicleId });
export const cancelViaje = (id) => apiClient.post(`ride/${id}/reject`);
export const pendingViaje = () => apiClient.get(`ride/pending`);
export const completeViaje = (id) => apiClient.post(`ride/${id}/complete`);
