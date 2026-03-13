'use client';

import { useMemo, useState, useRef, useCallback } from 'react';
import { useGetTransactionsQuery } from '@/shared/api/tonApi';
import { mapTransactionEventToView, TransactionCard } from '@/entities/transaction';
import type { TransactionViewModel } from '@/entities/transaction';
import { Skeleton } from '@/shared/ui/Skeleton';
import styles from './TransactionList.module.scss';

interface TransactionListProps {
    address: string;
}

type Filter = 'all' | 'income' | 'expense' | 'failed';

const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'income', label: 'Входящие' },
    { id: 'expense', label: 'Исходящие' },
    { id: 'failed', label: 'Failed' },
];

export const TransactionList = ({ address }: TransactionListProps) => {
    const [filter, setFilter] = useState<Filter>('all');
    const [beforeLt, setBeforeLt] = useState<number | undefined>(undefined);

    const { data: page, isLoading, isFetching } = useGetTransactionsQuery({
        address,
        beforeLt,
    });

    const nextFrom = page?.next_from;
    const hasMore = !!nextFrom;

    const viewModels = useMemo<TransactionViewModel[]>(() => {
        return (page?.events ?? [])
            .map((event) => mapTransactionEventToView(event, address))
            .filter((vm): vm is NonNullable<typeof vm> => vm !== null);
    }, [page?.events, address]);

    const filtered = useMemo<TransactionViewModel[]>(() => {
        switch (filter) {
            case 'income':
                return viewModels.filter((vm) => vm.direction === 'income');
            case 'expense':
                return viewModels.filter((vm) => vm.direction === 'expense');
            case 'failed':
                return viewModels.filter((vm) => !vm.isSuccess);
            default:
                return viewModels;
        }
    }, [viewModels, filter]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetching || !hasMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && nextFrom) {
                    setBeforeLt(nextFrom);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetching, hasMore, nextFrom],
    );

    if (isLoading && !page) {
        return (
            <div className={styles.transactionList}>
                <div className={styles.skeletons}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={styles.skeletonRow}>
                            <Skeleton
                                style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}
                            />
                            <div className={styles.skeletonInfo}>
                                <Skeleton style={{ width: '55%', height: 14 }} />
                                <Skeleton style={{ width: '35%', height: 12, marginTop: 6 }} />
                            </div>
                            <Skeleton style={{ width: 65, height: 14 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.transactionList}>
            <div className={styles.filters}>
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        className={`${styles.filterBtn} ${filter === f.id ? styles.active : ''}`}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 && !isFetching ? (
                <div className={styles.empty}>
                    {filter === 'all'
                        ? 'История транзакций пуста'
                        : 'Нет транзакций в этой категории'}
                </div>
            ) : (
                <div className={styles.list}>
                    {filtered.map((vm, index) => {
                        const isLast = index === filtered.length - 1;
                        return (
                            <div key={vm.id} ref={isLast ? lastItemRef : null}>
                                <TransactionCard data={vm} />
                            </div>
                        );
                    })}

                    {isFetching && (
                        <div className={styles.loadingMore}>
                            <div className={styles.dot} />
                            <div className={styles.dot} />
                            <div className={styles.dot} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
