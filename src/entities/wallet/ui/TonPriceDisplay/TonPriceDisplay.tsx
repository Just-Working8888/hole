import { useTonPrice } from "@/entities/wallet/model/useTonPrice";
import styles from "./TonPriceDisplay.module.scss";

interface TonPriceDisplayProps {
    tonBalance: number;
}

export const TonPriceDisplay = ({ tonBalance }: TonPriceDisplayProps) => {
    const { price, change24h, currencySymbol, isLoading, isError } = useTonPrice();

    if (isLoading) {
        return <div className={styles.skeleton} />;
    }

    if (isError || price === null) {
        return null;
    }

    const formattedValue = currencySymbol === '₽'
        ? `${(tonBalance * price).toFixed(0)} ₽`
        : `${currencySymbol}${(tonBalance * price).toFixed(2)}`;

    const isPositive = (change24h ?? 0) >= 0;
    const changeText = change24h !== null
        ? `${isPositive ? "+" : ""}${change24h.toFixed(2)}%`
        : null;

    return (
        <div className={styles.container}>
            <span className={styles.usdValue}>≈ {formattedValue}</span>
            {changeText && (
                <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                    {changeText} за 24ч
                </span>
            )}
        </div>
    );
};
