import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  console.log("access: " + accessToken)
}

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

// Lets the AuthProvider (which owns the user/session React state) react
// when a refresh fails here, since this module sits outside React.
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.data && typeof config.data === "object") {
    config.data = snakecaseKeys(config.data, { deep: true });
  }

  if (config.params && typeof config.params === "object") {
    config.params = snakecaseKeys(config.params, { deep: true });
  }

  return config;
});

api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === "object") {
    response.data = camelcaseKeys(response.data, { deep: true });
  }

  return response;
});

let isRefreshing = false;
let refreshTokenPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (!error.config || error.config.url === "/auth/login/" || error.config.url === "/auth/refresh/" || error.config._isRetry) {
      return Promise.reject(error);
    }

    error.config._isRetry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenPromise = api.post("/auth/refresh/")
        .then((response) => {
          setAccessToken(response.data.access);
        })
        .catch((e) => {
          setAccessToken(null);
          onUnauthorized?.();
          throw e;
        })
        .finally(() => {
          isRefreshing = false;
          refreshTokenPromise = null;
        });
    }

    try {
      await refreshTokenPromise;
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }

    return api(error.config);
  }
)
