import type { ApiLoginRequest, ApiLoginResponse, ApiRefreshResponse, ApiRegisterRequest, ApiRegisterResponse, ApiUpdateProfileRequest, ApiUser, ApiUserProfile } from "@/types/api";
import { api, setAccessToken } from "./client";

const authBaseUrl = "/auth"
const registerUrl = `${authBaseUrl}/register/`
const loginUrl = `${authBaseUrl}/login/`
const meUrl = `${authBaseUrl}/me/`
const refreshUrl = `${authBaseUrl}/refresh/`
const logoutUrl = `${authBaseUrl}/logout/`
const profileUrl = "/profile/"

export const authApi = {
    register: async (input: ApiRegisterRequest): Promise<ApiRegisterResponse> => {
        const response = await api.post<ApiRegisterResponse>(registerUrl, input);
        return response.data;
    },

    login: async (input: ApiLoginRequest): Promise<ApiLoginResponse> => {
        const response = await api.post<ApiLoginResponse>(loginUrl, input);
        setAccessToken(response.data.access);
        return response.data;
    },

    me: async (): Promise<ApiUser> => {
        const response = await api.get<ApiUser>(meUrl);
        return response.data;
    },

    refresh: async (): Promise<ApiRefreshResponse> => {
        const response = await api.post<ApiRefreshResponse>(refreshUrl);
        setAccessToken(response.data.access);
        return response.data;
    },

    logout: async () => {
        const response = await api.post(logoutUrl);
        setAccessToken(null);
        return response.data
    },

    preferences: async (input: ApiUpdateProfileRequest): Promise<ApiUserProfile> => {
        const response = await api.patch<ApiUserProfile>(profileUrl, input);
        return response.data;
    }
}