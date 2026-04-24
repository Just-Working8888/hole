import { useState } from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useGetAccountQuery } from '@/shared/api/tonApi';
import { BalanceDisplay } from '@/entities/wallet/index';
import { Skeleton } from '@/shared/ui/Skeleton/index';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Toast } from '@/shared/ui/Toast';
import { QRCodeDisplay } from '@/features/receive-transaction/ui/QRCodeDisplay';
import { TonPriceDisplay } from '@/entities/wallet/ui/TonPriceDisplay/TonPriceDisplay';
import { SendModal } from '@/features/send-transaction';
import styles from './WalletCard.module.scss';

interface WalletCardProps {
    address: string;
}

const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export const WalletCard = ({ address }: WalletCardProps) => {
    const { data: account, isLoading, isError } = useGetAccountQuery(address);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);
    const [isSendOpen, setIsSendOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(account?.address ?? address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
            onClick: () => setIsSendOpen(true),
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
            onClick: () => setIsReceiveOpen(true),
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
            onClick: () => console.log('Exchange — скоро...'),
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
            onClick: () => console.log('Buy — скоро...'),
        },
    ];

    return (
        <>
            <div className={styles.walletCard}>
                <div className={styles.header}>
                    <div className={styles.balanceInfo}>
                        <BalanceDisplay amount={account.balance} symbol="TON" />
                        <TonPriceDisplay tonBalance={account.balance} />
                        <button className={styles.addressChip} onClick={handleCopyAddress}>
                            {shortenAddress(account.address)}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>
                    </div>
                    <TonConnectButton />
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

            {isSendOpen && (
                <SendModal
                    onClose={() => setIsSendOpen(false)}
                    maxBalance={account.balance}
                    walletAddress={address}
                />
            )}

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

            <Toast message="Скопировано!" visible={copied} />
        </>
    );
};
