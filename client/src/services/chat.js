import apiClient from "@/utils/api-client";

export const getListOfChats = () => apiClient.get(`chat`);
export const getChat = (id) => apiClient.get(`chat/${id}`);
export const markAsSeen = (id) => apiClient.patch(`chat/${id}/mark-as-seen`);
