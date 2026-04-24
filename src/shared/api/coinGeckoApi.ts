import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface TonPriceResponse {
    "the-open-network": {
        usd: number;
        usd_24h_change: number;
        eur: number;
        eur_24h_change: number;
        rub: number;
        rub_24h_change: number;
    };
}

export const coinGeckoApi = createApi({
    reducerPath: "coinGeckoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_COINGECKO_API_URL ?? "https://api.coingecko.com/api/v3",
    }),
    keepUnusedDataFor: 60,
    endpoints: (builder) => ({
        getTonPrice: builder.query<TonPriceResponse, void>({
            query: () => ({
                url: "/simple/price",
                params: {
                    ids: "the-open-network",
                    vs_currencies: "usd,eur,rub",
                    include_24hr_change: true,
                },
            }),
        }),
    }),
});

export const { useGetTonPriceQuery } = coinGeckoApi;
