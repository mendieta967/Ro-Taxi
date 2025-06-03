import apiClient from "../utils/api-client";


export const getUser = (id) => apiClient.get(`user/${id}`);

