// src/entities/wallet/ui/BalanceDisplay.tsx
import styles from './BalanceDisplay.module.scss';

export const BalanceDisplay = ({ amount, symbol }: { amount: number; symbol: string }) => (
    <div className={styles.balanceContainer}>
        <div className={styles.mainBalance}>
            <span className={styles.amount}>{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={styles.symbol}>{symbol}</span>
        </div>

    </div>
);