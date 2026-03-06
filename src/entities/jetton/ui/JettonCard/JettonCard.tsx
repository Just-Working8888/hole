import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import type { Jetton } from '../../model/schema';
import styles from './JettonCard.module.scss';

interface JettonCardProps {
    jetton: Jetton;
}

export const JettonCard = memo(({ jetton }: JettonCardProps) => {
    return (
        <Link href={`/jettons/${jetton.jetton}`} className={styles.card}>
            <div className={styles.iconWrapper}>
                <Image
                    src={jetton.img}
                    alt={jetton.symbol}
                    width={40}
                    height={40}
                    className={styles.icon}
                    unoptimized
                />
            </div>

            <div className={styles.info}>
                <div className={styles.row}>
                    <span className={styles.symbol}>{jetton.symbol}</span>
                    <span className={styles.price}>
                        ${jetton.priceUsd < 0.0001 ? jetton.priceUsd.toExponential(2) : jetton.priceUsd.toFixed(4)}
                    </span>
                </div>
                <div className={styles.row}>
                    <span className={styles.name}>{jetton.name}</span>
                    <span className={`${styles.change} ${jetton.priceChange24h >= 0 ? styles.positive : styles.negative}`}>
                        {jetton.priceChange24h > 0 ? '+' : ''}{jetton.priceChange24h.toFixed(2)}%
                    </span>
                </div>
            </div>

            {jetton.chartDark && (
                <div className={styles.chartWrapper}>
                    <Image
                        src={jetton.chartDark}
                        alt="chart"
                        fill
                        className={styles.chart}
                        unoptimized
                    />
                </div>
            )}
        </Link>
    );
});

JettonCard.displayName = 'JettonCard';
