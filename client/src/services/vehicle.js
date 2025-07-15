import apiClient from "../utils/api-client";

export const getVehicles = () => apiClient.get("vehicle");
export const createVehicles = (data) => apiClient.post("vehicle", data);
