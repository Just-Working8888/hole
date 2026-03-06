'use client';

import { JettonsList } from '@/features/jettons-market';
import styles from './page.module.scss';

export default function JettonsPage() {
    return (
        <main className={styles.page}>
            <JettonsList />
        </main>
    );
}
