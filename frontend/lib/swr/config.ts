import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateOnMount: true,
  dedupingInterval: 86400000, // 24 hours
  refreshInterval: 0,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};
