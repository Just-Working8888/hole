import { useTonPrice } from "@/entities/wallet/model/useTonPrice";
import styles from "./TonPriceDisplay.module.scss";

interface TonPriceDisplayProps {
    /** Баланс в TON (уже переведённый из nano) */
    tonBalance: number;
}

/**
 * Компонент показывает USD-эквивалент баланса и изменение курса за 24ч.
 * Вставляется в WalletCard под строкой с TON балансом.
 */
export const TonPriceDisplay = ({ tonBalance }: TonPriceDisplayProps) => {
    const { priceUsd, change24h, isLoading, isError } = useTonPrice();

    // Пока грузится — показываем плейсхолдер чтобы не прыгал layout
    if (isLoading) {
        return <div className={styles.skeleton} />;
    }

    // Если API недоступен — тихо скрываем, не ломаем UI
    if (isError || priceUsd === null) {
        return null;
    }

    const usdValue = (tonBalance * priceUsd).toFixed(2);
    const isPositive = (change24h ?? 0) >= 0;
    const changeText = change24h !== null
        ? `${isPositive ? "+" : ""}${change24h.toFixed(2)}%`
        : null;

    return (
        <div className={styles.container}>
            <span className={styles.usdValue}>≈ ${usdValue}</span>
            {changeText && (
                <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                    {changeText} за 24ч
                </span>
            )}
        </div>
    );
};
