import useSWR from "swr";
import {
  fetcher,
  Video,
  PaginatedResponse,
  ApiResponse,
} from "@/lib/api/client";
import { swrConfig } from "@/lib/swr/config";

const CACHE_KEYS = {
  all: "/videos",
  single: (id: string) => `/videos/${id}`,
};

export function useVideos(page = 1, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Video>>(
    `${CACHE_KEYS.all}?page=${page}&limit=${limit}`,
    fetcher,
    {
      ...swrConfig,
      fallbackData: {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
    },
  );

  return {
    videos: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useVideo(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Video>>(
    id ? CACHE_KEYS.single(id) : null,
    fetcher,
    {
      ...swrConfig,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.response?.status === 404) return;
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    },
  );

  return {
    video: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
