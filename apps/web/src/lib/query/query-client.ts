import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: false, // Evita refetch innecesarios en mobile
			retry: 1,
		},
		mutations: {
			retry: 1,
		},
	},
});
