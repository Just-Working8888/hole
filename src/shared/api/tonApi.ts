// src/shared/api/tonApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AccountSchema } from '@/entities/wallet/model/schema';

export const tonApi = createApi({
    reducerPath: 'tonApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://tonapi.io/v2' }), // Публичный API
    endpoints: (builder) => ({
        getAccount: builder.query({
            query: (address: string) => `/accounts/${address}`,
            // ТРАНСФОРМАЦИЯ: Здесь мы запускаем наш Zod
            transformResponse: (response: unknown) => AccountSchema.parse(response),
        }),
        getTransactions: builder.query({
            query: (address: string) => `/accounts/${address}/events?limit=10`,
            // Тут можно добавить сложную трансформацию, чтобы отфильтровать только нужные поля
            transformResponse: (response: any) => response.events,
        }),
    }),
});

export const { useGetAccountQuery, useGetTransactionsQuery } = tonApi;