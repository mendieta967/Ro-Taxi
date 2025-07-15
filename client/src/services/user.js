import apiClient from "../utils/api-client";

export const getUser = (id) => apiClient.get(`user/${id}`);
export const getAll = (pageNumber = 1, pageSize = 25, search = "") => {
  let url = `user?pageNumber=${pageNumber}&pageSize=${pageSize}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  return apiClient.get(url);
};
