import apiClient from "../utils/api-client";

export const getUser = (id) => apiClient.get(`user/${id}`);
export const getAll = (search = "", pageNumber = 1, pageSize = 10) => {
  return apiClient.get("user", {
    params: {
      search,
      pageNumber,
      pageSize,
    },
  });
};
