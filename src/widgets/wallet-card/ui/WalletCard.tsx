import { useState } from 'react';
import { useGetAccountQuery } from '@/shared/api/tonApi';
import { BalanceDisplay } from '@/entities/wallet/index';
import { Skeleton } from '@/shared/ui/Skeleton/index';
import { Modal } from '@/shared/ui/Modal/Modal';
import { QRCodeDisplay } from '@/features/receive-transaction/ui/QRCodeDisplay';
import styles from './WalletCard.module.scss';

interface WalletCardProps {
    address: string;
}

export const WalletCard = ({ address }: WalletCardProps) => {
    const { data: account, isLoading, isError } = useGetAccountQuery(address);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    if (isLoading) {
        return (
            <div className={`${styles.walletCard} ${styles.loading}`}>
                <Skeleton className={styles.loadingBalance} />
                <div className={styles.loadingButtons}>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>
        );
    }

    if (isError || !account) {
        return (
            <div className={`${styles.walletCard} ${styles.errorState}`}>
                <p>Не удалось загрузить данные кошелька</p>
                <button onClick={() => window.location.reload()}>Повторить</button>
            </div>
        );
    }

    const handleSend = () => {
        console.log('Логика отправки транзакции через TonConnect...');
    };

    const handleReceive = () => {
        setIsReceiveOpen(true);
    };

    const handleExchange = () => {
        console.log('Exchange — скоро...');
    };

    const handleBuy = () => {
        console.log('Buy — скоро...');
    };

    const actions = [
        {
            key: 'send',
            label: 'Отправить',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                </svg>
            ),
            onClick: handleSend,
        },
        {
            key: 'receive',
            label: 'Получить',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                </svg>
            ),
            onClick: handleReceive,
        },
        {
            key: 'exchange',
            label: 'Обмен',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
            ),
            onClick: handleExchange,
        },
        {
            key: 'buy',
            label: 'Купить',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            onClick: handleBuy,
        },
    ];

    return (
        <>
            <div className={styles.walletCard}>
                <div className={styles.header}>
                    <BalanceDisplay amount={account.balance} symbol="TON" />
                </div>

                <div className={styles.actions}>
                    {actions.map((action) => (
                        <button
                            key={action.key}
                            className={styles.actionButton}
                            onClick={action.onClick}
                        >
                            <span className={styles.actionIcon}>{action.icon}</span>
                            <span className={styles.actionLabel}>{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {isReceiveOpen && (
                <Modal onClose={() => setIsReceiveOpen(false)}>
                    <Modal.Header title="Ваш адрес TON" />
                    <Modal.Body>
                        <div style={{ display: 'grid' }}>
                            <QRCodeDisplay address={account.address} />
                        </div>
                        <p style={{
                            marginTop: '1rem',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            color: '#9ca3af',
                            textAlign: 'center',
                            wordBreak: 'break-all',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '0.5rem',
                        }}>
                            {account.address}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className={styles.copyButton}
                            onClick={() => navigator.clipboard.writeText(account.address)}
                        >
                            Копировать адрес
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};