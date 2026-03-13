'use client';

import Image from 'next/image';
import { useGetJettonBalancesQuery } from '@/shared/api/tonApi';
import { Skeleton } from '@/shared/ui/Skeleton';
import { formatJettonBalance } from '@/shared/lib/format-balance';
import styles from './JettonBalancesList.module.scss';

interface JettonBalancesListProps {
    address: string;
}

export const JettonBalancesList = ({ address }: JettonBalancesListProps) => {
    const { data: balances, isLoading } = useGetJettonBalancesQuery(address);

    if (isLoading) {
        return (
            <div className={styles.container}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={styles.skeletonRow}>
                        <Skeleton style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                        <div className={styles.skeletonInfo}>
                            <Skeleton style={{ width: 80, height: 14 }} />
                            <Skeleton style={{ width: 50, height: 12, marginTop: 5 }} />
                        </div>
                        <Skeleton style={{ width: 60, height: 14, marginLeft: 'auto' }} />
                    </div>
                ))}
            </div>
        );
    }

    const nonZero = (balances ?? []).filter((b) => Number(b.balance) > 0);

    if (!nonZero.length) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Токены</h3>
            <div className={styles.list}>
                {nonZero.map((item) => (
                    <div key={item.jetton.address} className={styles.row}>
                        <div className={styles.iconWrap}>
                            {item.jetton.image ? (
                                <Image
                                    src={item.jetton.image}
                                    alt={item.jetton.symbol}
                                    width={36}
                                    height={36}
                                    className={styles.icon}
                                />
                            ) : (
                                <div className={styles.iconFallback}>
                                    {item.jetton.symbol.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className={styles.info}>
                            <span className={styles.name}>{item.jetton.name}</span>
                            <span className={styles.symbol}>{item.jetton.symbol}</span>
                        </div>
                        <span className={styles.balance}>
                            {formatJettonBalance(item.balance, item.jetton.decimals)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
