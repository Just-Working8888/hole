import { useMemo } from 'react';
import { useGetTransactionsQuery } from '@/shared/api/tonApi';
import {
    mapTransactionEventToView,
    TransactionCard,
} from '@/entities/transaction';
import type { TransactionEvent } from '@/entities/transaction';
import styles from './TransactionList.module.scss';

interface TransactionListProps {
    address: string;
}

export const TransactionList = ({ address }: TransactionListProps) => {
    const { data: events, isLoading } = useGetTransactionsQuery(address);

    const viewModels = useMemo(() => {
        if (!events) return [];
        return (events as TransactionEvent[])
            .map((event) => mapTransactionEventToView(event, address))
            .filter((vm): vm is NonNullable<typeof vm> => vm !== null);
    }, [events, address]);

    if (isLoading) {
        return <div className={styles.loading}>Загрузка истории...</div>;
    }

    if (!viewModels.length) {
        return <div className={styles.empty}>История транзакций пуста</div>;
    }

    return (
        <div className={styles.transactionList}>
            <div className={styles.list}>
                {viewModels.map((vm) => (
                    <TransactionCard key={vm.id} data={vm} />
                ))}
            </div>
        </div>
    );
};
