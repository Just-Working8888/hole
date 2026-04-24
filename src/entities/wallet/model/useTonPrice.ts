import { useGetTonPriceQuery } from "@/shared/api/coinGeckoApi";
import { useAppSelector } from "@/shared/model/hooks";

interface UseTonPriceResult {
    price: number | null;
    change24h: number | null;
    currencySymbol: string;
    isLoading: boolean;
    isError: boolean;
}

export const useTonPrice = (): UseTonPriceResult => {
    const { data, isLoading, isError } = useGetTonPriceQuery();
    const currency = useAppSelector((state) => state.settings.currency);

    const ton = data?.["the-open-network"];

    let price: number | null = null;
    let change24h: number | null = null;
    let currencySymbol = '$';

    if (ton) {
        switch (currency) {
            case 'EUR':
                price = ton.eur ?? null;
                change24h = ton.eur_24h_change ?? null;
                currencySymbol = '€';
                break;
            case 'RUB':
                price = ton.rub ?? null;
                change24h = ton.rub_24h_change ?? null;
                currencySymbol = '₽';
                break;
            default:
                price = ton.usd ?? null;
                change24h = ton.usd_24h_change ?? null;
                currencySymbol = '$';
        }
    }

    return { price, change24h, currencySymbol, isLoading, isError };
};
