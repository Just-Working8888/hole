"use client";

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/shared/model/hooks';
import { WalletCard } from '@/widgets/wallet-card';
import { AuthForm } from '@/features/auth-by-address';
import { TransactionList } from '@/features/transaction-history';
import styles from './page.module.scss';

export default function HomePage() {
  const { isAuth, address } = useAppSelector((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isAuth) {
    return (
      <main className={`${styles.pageContent} ${styles.authWrapper}`}>
        <AuthForm />
      </main>
    );
  }

  return (
    <main className={`${styles.pageContent} ${styles.dashboard}`}>
      <WalletCard address={address!} />
      <TransactionList address={address!} />
    </main>
  );
}
