'use client';

import { useAppSelector } from '@/shared/model/hooks';
import { TransactionList } from '@/features/transaction-history';
import styles from './page.module.scss';

export default function HistoryPage() {
    const { isAuth, address } = useAppSelector((state) => state.user);

    if (!isAuth) {
        return (
            <main className={styles.page}>
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🔒</span>
                    <p>Войдите, чтобы увидеть историю</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.pageHeader}>
                <h1>История</h1>
            </div>
            <TransactionList address={address!} />
        </main>
    );
}
