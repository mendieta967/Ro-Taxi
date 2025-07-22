import apiClient from "../utils/api-client";

export const getDriver = () => apiClient.get(`ride/scheduled-for-driver`);
export const acceptViaje = (id) => apiClient.post(`ride/${id}/accept`);
