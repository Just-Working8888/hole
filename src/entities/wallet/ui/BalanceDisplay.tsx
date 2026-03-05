// src/entities/wallet/ui/BalanceDisplay.tsx
import styles from './BalanceDisplay.module.scss';

const TON_ICON_URL =
    'https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/46db595e47fca18285c42eaa720fd4cdf3cc4940e1490ec07c77d21f2cf961cf.png';

export const BalanceDisplay = ({ amount, symbol }: { amount: number; symbol: string }) => (
    <div className={styles.balanceContainer}>
        <div className={styles.mainBalance}>
            <span className={styles.amount}>{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={styles.symbol}>{symbol}</span>
        </div>
        <div className={styles.tokenRow}>
            <img src={TON_ICON_URL} alt={symbol} className={styles.tokenIcon} />
            <span className={styles.tokenLabel}>Toncoin</span>
        </div>
    </div>
);