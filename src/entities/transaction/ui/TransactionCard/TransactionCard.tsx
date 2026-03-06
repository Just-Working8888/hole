import { memo } from 'react';
import Image from 'next/image';
import type { TransactionViewModel } from '../../model/types';
import styles from './TransactionCard.module.scss';

interface TransactionCardProps {
    data: TransactionViewModel;
}

export const TransactionCard = memo(({ data }: TransactionCardProps) => {
    const {
        typeTitle,
        description,
        displayValue,
        direction,
        isSuccess,
        iconUrl,
        fallbackEmoji,
        date,
        time,
    } = data;

    const valueClass =
        direction === 'income' || displayValue.startsWith('+')
            ? `${styles.value} ${styles.positive}`
            : `${styles.value} ${styles.negative}`;

    return (
        <div className={styles.eventCard}>
            <div className={styles.iconWrapper}>
                {iconUrl ? (
                    <Image src={iconUrl} alt={typeTitle} width={40} height={40} />
                ) : (
                    fallbackEmoji
                )}
            </div>

            <div className={styles.info}>
                <div className={styles.headerRow}>
                    <p className={styles.title}>
                        {typeTitle}
                        {direction === 'income' && (
                            <span className={`${styles.directionBadge} ${styles.income}`}>
                                Получаю
                            </span>
                        )}
                        {direction === 'expense' && (
                            <span className={`${styles.directionBadge} ${styles.expense}`}>
                                Трачу
                            </span>
                        )}
                        {!isSuccess && (
                            <span className={styles.failedBadge}>Failed</span>
                        )}
                    </p>
                    <span className={valueClass}>{displayValue}</span>
                </div>

                <p className={styles.description}>{description}</p>

                <p className={styles.date}>
                    {date} • {time}
                </p>
            </div>
        </div>
    );
});

TransactionCard.displayName = 'TransactionCard';
