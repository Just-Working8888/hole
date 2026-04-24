'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGetJettonQuery } from '@/shared/api/tonApi';
import { JettonPriceChart } from '@/features/jetton-chart';
import styles from './page.module.scss';

type Period = '1d' | '7d' | '30d';

const PERIODS: { id: Period; label: string }[] = [
    { id: '1d', label: '1Д' },
    { id: '7d', label: '7Д' },
    { id: '30d', label: '30Д' },
];

export default function JettonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const address = params?.address as string | undefined;
    const [period, setPeriod] = useState<Period>('7d');

    const { data: jetton, isLoading, isError } = useGetJettonQuery(address || '', {
        skip: !address,
    });

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className={styles.loading}>Загрузка токена...</div>
            </main>
        );
    }

    if (isError || !jetton) {
        return (
            <main className={styles.page}>
                <div className={styles.topBar}>
                    <button onClick={() => router.back()} className={styles.backBtn}>‹ Назад</button>
                </div>
                <div className={styles.error}>Ошибка загрузки. Возможно, токен не найден.</div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.topBar}>
                <button onClick={() => router.back()} className={styles.backBtn}>‹ Назад</button>
            </div>

            <div className={styles.header}>
                {jetton.metadata?.image && (
                    <Image
                        src={jetton.metadata.image}
                        alt={jetton.metadata.symbol || 'Jetton'}
                        width={64}
                        height={64}
                        className={styles.icon}
                        unoptimized
                    />
                )}
                <div>
                    <h1>{jetton.metadata?.name || 'Unknown Jetton'}</h1>
                    <span className={styles.symbol}>{jetton.metadata?.symbol || '???'}</span>
                </div>
            </div>

            {/* График */}
            {address && (
                <div className={styles.chartSection}>
                    <div className={styles.periodSelector}>
                        {PERIODS.map((p) => (
                            <button
                                key={p.id}
                                className={`${styles.periodBtn} ${period === p.id ? styles.periodActive : ''}`}
                                onClick={() => setPeriod(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <JettonPriceChart jettonAddress={address} period={period} />
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.row}>
                    <span className={styles.label}>Общее предложение (Supply):</span>
                    <span className={styles.value}>
                        {(Number(jetton.total_supply) / (10 ** Number(jetton.metadata?.decimals || 9))).toLocaleString()}
                    </span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>Mintable:</span>
                    <span className={styles.value}>{jetton.mintable ? 'Да' : 'Нет'}</span>
                </div>
            </div>

            <div className={styles.contractAddress}>
                <span className={styles.label}>Адрес контракта:</span>
                <p className={styles.addressHash}>{jetton.metadata?.address}</p>
            </div>
        </main>
    );
}
