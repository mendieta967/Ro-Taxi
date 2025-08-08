import apiClient from "../utils/api-client";

export const getUser = (id) => apiClient.get(`user/${id}`);
// services/user.js
// ejemplo en services/user.js
export const getAll = (pageNumber, pageSize, search = "") =>
  apiClient.get(
    `user?Page=${pageNumber}&PageSize=${pageSize}&Search=${search}`
  );
export const editUserStatus = (userId) => apiClient.patch(`user/${userId}`);
export const passwordReset = (email) =>
  apiClient.post("user/forgot-password", { email });

export const recoverPassword = (token, password) =>
  apiClient.post("user/reset-password", { token, password });
export const deleteUser = (password) =>
  apiClient.post("user/delete-account", {
    validateUserRequest: {
      providedPassword: password,
    },
  });
