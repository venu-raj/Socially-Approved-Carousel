import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

export const fetcher = (url: string) =>
  apiClient.get(url).then((res) => res.data);

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  likes: number;
  shares: number;
  comments: number;
  customerName: string;
  customerTitle: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export const videoApi = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Video>> => {
    const response = await apiClient.get(`/videos?page=${page}&limit=${limit}`);
    return response.data;
  },

  getOne: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Video>,
  ): Promise<ApiResponse<Video>> => {
    const response = await apiClient.put(`/videos/${id}`, data);
    return response.data;
  },
};
