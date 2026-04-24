import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AccountSchema } from '@/entities/wallet/model/schema';
import type { TransactionEvent } from '@/entities/transaction/model/types';
import type { JettonBalanceItem } from '@/entities/jetton/model/balanceTypes';

export interface TransactionPage {
    events: TransactionEvent[];
    next_from?: number;
}

export interface GetTransactionsParams {
    address: string;
    beforeLt?: number;
}

export interface ChartDataPoint {
    timestamp: number;
    price: number;
}

export const tonApi = createApi({
    reducerPath: 'tonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_TON_API_URL ?? 'https://tonapi.io/v2',
    }),
    endpoints: (builder) => ({
        getAccount: builder.query({
            query: (address: string) => `/accounts/${address}`,
            transformResponse: (response: unknown) => AccountSchema.parse(response),
        }),
        getTransactions: builder.query<TransactionPage, GetTransactionsParams>({
            query: ({ address, beforeLt }) => {
                let url = `/accounts/${address}/events?limit=20`;
                if (beforeLt) url += `&before_lt=${beforeLt}`;
                return url;
            },
            serializeQueryArgs: ({ queryArgs }) => queryArgs.address,
            merge: (currentCache, newItems, { arg }) => {
                if (!arg.beforeLt) {
                    currentCache.events = newItems.events;
                    currentCache.next_from = newItems.next_from;
                } else {
                    currentCache.events.push(...newItems.events);
                    currentCache.next_from = newItems.next_from;
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.beforeLt !== previousArg?.beforeLt;
            },
            transformResponse: (response: { events: unknown[]; next_from?: number }) => ({
                events: response.events as TransactionEvent[],
                next_from: response.next_from,
            }),
        }),
        getJetton: builder.query({
            query: (address: string) => `/jettons/${address}`,
        }),
        getJettonBalances: builder.query<JettonBalanceItem[], string>({
            query: (address: string) => `/accounts/${address}/jettons`,
            transformResponse: (response: { balances: JettonBalanceItem[] }) =>
                response.balances ?? [],
        }),
        getJettonWalletAddress: builder.query<string, { accountId: string; jettonAddress: string }>({
            query: ({ accountId, jettonAddress }) =>
                `/accounts/${accountId}/jettons/${jettonAddress}/wallet`,
            transformResponse: (response: { address: string }) => response.address,
        }),
        getTokenPriceChart: builder.query<ChartDataPoint[], { address: string; period: '1d' | '7d' | '30d' }>({
            query: ({ address, period }) => {
                const end = Math.floor(Date.now() / 1000);
                const seconds = period === '1d' ? 86400 : period === '7d' ? 604800 : 2592000;
                const start = end - seconds;
                return `/rates/chart?tokens=${address}&currency=USD&start_date=${start}&end_date=${end}&points_count=50`;
            },
            transformResponse: (response: { points: [number, string][] }) =>
                (response.points ?? []).map(([ts, price]) => ({ timestamp: ts * 1000, price: Number(price) })),
        }),
    }),
});

export const {
    useGetAccountQuery,
    useGetTransactionsQuery,
    useGetJettonQuery,
    useGetJettonBalancesQuery,
    useGetJettonWalletAddressQuery,
    useGetTokenPriceChartQuery,
} = tonApi;
