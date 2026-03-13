import { useGetTonPriceQuery } from "@/shared/api/coinGeckoApi";

interface UseTonPriceResult {
    priceUsd: number | null;
    change24h: number | null;
    isLoading: boolean;
    isError: boolean;
}

/**
 * Хук возвращает текущий курс TON в USD и изменение за 24ч.
 * Пример использования:
 *   const { priceUsd, change24h } = useTonPrice();
 *   const usdValue = tonBalance * (priceUsd ?? 0);
 */
export const useTonPrice = (): UseTonPriceResult => {
    const { data, isLoading, isError } = useGetTonPriceQuery();

    const priceUsd = data?.["the-open-network"]?.usd ?? null;
    const change24h = data?.["the-open-network"]?.usd_24h_change ?? null;

    return { priceUsd, change24h, isLoading, isError };
};
