'use client';

import { useMemo, useState, useRef, useCallback } from 'react';
import { useGetTransactionsQuery } from '@/shared/api/tonApi';
import { mapTransactionEventToView, TransactionCard } from '@/entities/transaction';
import type { TransactionViewModel } from '@/entities/transaction';
import { Skeleton } from '@/shared/ui/Skeleton';
import { TransactionDetailModal } from './TransactionDetailModal/TransactionDetailModal';
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

const formatGroupDate = (dateStr: string): string => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toLocaleDateString();
    if (dateStr === today) return 'Сегодня';
    if (dateStr === yesterday) return 'Вчера';
    return dateStr;
};

export const TransactionList = ({ address }: TransactionListProps) => {
    const [filter, setFilter] = useState<Filter>('all');
    const [beforeLt, setBeforeLt] = useState<number | undefined>(undefined);
    const [selectedTx, setSelectedTx] = useState<TransactionViewModel | null>(null);

    const { data: page, isLoading, isFetching } = useGetTransactionsQuery({
        address,
        beforeLt,
    });

    const allEvents = page?.events ?? [];
    const nextFrom = page?.next_from;
    const hasMore = !!nextFrom;

    const viewModels = useMemo<TransactionViewModel[]>(() => {
        return allEvents
            .map((event) => mapTransactionEventToView(event, address))
            .filter((vm): vm is NonNullable<typeof vm> => vm !== null);
    }, [allEvents, address]);

    const filtered = useMemo<TransactionViewModel[]>(() => {
        switch (filter) {
            case 'income':  return viewModels.filter((vm) => vm.direction === 'income');
            case 'expense': return viewModels.filter((vm) => vm.direction === 'expense');
            case 'failed':  return viewModels.filter((vm) => !vm.isSuccess);
            default:        return viewModels;
        }
    }, [viewModels, filter]);

    // Group by date
    const grouped = useMemo(() => {
        const groups: { date: string; items: TransactionViewModel[] }[] = [];
        const seen = new Map<string, TransactionViewModel[]>();
        for (const vm of filtered) {
            if (!seen.has(vm.date)) {
                const arr: TransactionViewModel[] = [];
                seen.set(vm.date, arr);
                groups.push({ date: vm.date, items: arr });
            }
            seen.get(vm.date)!.push(vm);
        }
        return groups;
    }, [filtered]);

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

    if (isLoading && allEvents.length === 0) {
        return (
            <div className={styles.transactionList}>
                <div className={styles.skeletons}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={styles.skeletonRow}>
                            <Skeleton style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
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

    // flat list of items for last-item ref calculation
    const allFiltered = grouped.flatMap((g) => g.items);
    const lastItemId = allFiltered[allFiltered.length - 1]?.id;

    return (
        <>
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

                {grouped.length === 0 && !isFetching ? (
                    <div className={styles.empty}>
                        {filter === 'all'
                            ? 'История транзакций пуста'
                            : 'Нет транзакций в этой категории'}
                    </div>
                ) : (
                    <div className={styles.list}>
                        {grouped.map((group) => (
                            <div key={group.date}>
                                <div className={styles.dateSeparator}>
                                    <span className={styles.dateSeparatorText}>
                                        {formatGroupDate(group.date)}
                                    </span>
                                </div>
                                {group.items.map((vm, idx) => (
                                    <div
                                        key={vm.id}
                                        ref={vm.id === lastItemId ? lastItemRef : null}
                                        className={styles.fadeItem}
                                        style={{ animationDelay: `${Math.min(idx * 35, 150)}ms` }}
                                    >
                                        <TransactionCard data={vm} onClick={() => setSelectedTx(vm)} />
                                    </div>
                                ))}
                            </div>
                        ))}

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

            {selectedTx && (
                <TransactionDetailModal
                    data={selectedTx}
                    onClose={() => setSelectedTx(null)}
                />
            )}
        </>
    );
};
