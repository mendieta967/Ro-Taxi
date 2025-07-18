import apiClient from "../utils/api-client";

export const createVehicles = (data) => apiClient.post("vehicle", data);
export const getVehicles = (pageNumberVehicle, pageSizevehicle, search = "") =>
  apiClient.get(
    `vehicle?Page=${pageNumberVehicle}&PageSize=${pageSizevehicle}&Search=${search}`
  );

export const updateVehicles = (id, data) =>
  apiClient.put(`vehicle/${id}`, data);

export const deleteVehicles = (id) => apiClient.delete(`vehicle/${id}`);
