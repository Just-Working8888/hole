import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { JettonsResponseSchema, type Jetton } from '@/entities/jetton/model/schema';

export type JettonCategory = 'jettons' | 'taponomics' | 'stablecoins';

export interface GetJettonsParams {
    category?: JettonCategory;
    limit?: number;
    offset?: number;
}

export const dyorApi = createApi({
    reducerPath: 'dyorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/dyor',
    }),
    tagTypes: ['Jettons'],
    endpoints: (builder) => ({
        getJettons: builder.query<Jetton[], GetJettonsParams>({
            query: ({ category = 'jettons', limit = 40, offset = 0 }) =>
                `/jettons/all?limit=${limit}&offset=${offset}&category=${category}`,
            providesTags: (result, error, { category }) => [
                { type: 'Jettons', id: category || 'all' },
            ],
            // Only keep one cache entry per category
            serializeQueryArgs: ({ queryArgs }) => {
                return queryArgs.category || 'jettons';
            },
            // Merge new items into the cache array
            merge: (currentCache, newItems, { arg }) => {
                if (arg.offset === 0) {
                    return newItems; // Reset cache on new category or initial fetch
                }
                currentCache.push(...newItems);
            },
            // Force refetch when offset changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.offset !== previousArg?.offset || currentArg?.category !== previousArg?.category;
            },
            transformResponse: (response: unknown) => {
                const result = JettonsResponseSchema.safeParse(response);
                if (!result.success) {
                    console.error("Zod Parsing Error in dyorApi:", result.error);
                    throw new Error(`Jettons schema error: ${result.error.message}`);
                }
                return result.data;
            },
        }),
    }),
});

export const { useGetJettonsQuery } = dyorApi;
