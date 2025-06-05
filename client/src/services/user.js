import apiClient from "../utils/api-client";

export const getUser = (id) => apiClient.get(`user/${id}`);
export const getAll = () => apiClient.get("user");
