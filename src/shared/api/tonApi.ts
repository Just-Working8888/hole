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
    }),
});

export const {
    useGetAccountQuery,
    useGetTransactionsQuery,
    useGetJettonQuery,
    useGetJettonBalancesQuery,
} = tonApi;
