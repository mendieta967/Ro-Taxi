import apiClient from "../utils/api-client";

export const getCurrentUser = () => apiClient.get("me");

export const completeAccount = (data) =>
  apiClient.put("complete-account", data);

export const linkGithubProvider = () => {
  const authUrl = "https://github.com/login/oauth/authorize";

  const query = new URLSearchParams({
    client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
    scope: "user:email",
  }).toString();

  return `${authUrl}?${query}`;
};
