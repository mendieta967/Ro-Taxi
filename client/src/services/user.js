import apiClient from "../utils/api-client";

export const getUser = (id) => apiClient.get(`user/${id}`);
// services/user.js
// ejemplo en services/user.js
export const getAll = (pageNumber, pageSize, search = "") =>
  apiClient.get(
    `user?Page=${pageNumber}&PageSize=${pageSize}&Search=${search}`
  );
export const editUser = (userId) => apiClient.patch(`user/${userId}`);
export const deleteUser = () => apiClient.delete("user/delete-account");
