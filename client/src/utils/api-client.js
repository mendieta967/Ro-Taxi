const baseUrl = import.meta.env.VITE_BASE_URL + "/api";

const apiClient = {
  get: (url) => request(url, { method: "GET" }),
  post: (url, body = {}) =>
    request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
  put: (url, body) =>
    request(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
  patch: (url, body) =>
    request(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),

  delete: (url) =>
    request(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }),
};
const request = async (url, options) => {
  const response = await fetch(`${baseUrl}/${url}`, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      const refreshOk = await refresh();
      if (refreshOk) return request(url, options);
    }

    // 👇 Intentamos leer el cuerpo como JSON
    let errorMessage = `Error ${response.statusText}: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      console.log("Error al leer el cuerpo de la respuesta:", e);
    }

    // ❌ Lanzamos error con mensaje personalizado
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return response.text();
};

const refresh = async () => {
  const response = await fetch(`${baseUrl}/refresh`, {
    credentials: "include",
    method: "POST",
  });
  if (!response.ok)
    throw new Error(`Error refreshing the token: ${response.statusText}`);
  return true;
};

export default apiClient;
