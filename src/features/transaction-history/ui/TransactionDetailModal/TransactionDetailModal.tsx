'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/shared/ui/Modal/Modal';
import type { TransactionViewModel } from '@/entities/transaction';
import styles from './TransactionDetailModal.module.scss';

interface TransactionDetailModalProps {
    data: TransactionViewModel;
    onClose: () => void;
}

function shortAddr(addr: string): string {
    return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
}

export const TransactionDetailModal = ({ data, onClose }: TransactionDetailModalProps) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copy = (value: string, field: string) => {
        navigator.clipboard.writeText(value).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 1500);
        });
    };

    const valueClass =
        data.direction === 'income' || data.displayValue.startsWith('+')
            ? styles.positive
            : styles.negative;

    return (
        <Modal onClose={onClose}>
            <Modal.Header title="Детали транзакции" />
            <Modal.Body>
                <div className={styles.topSection}>
                    <div className={styles.iconWrapper}>
                        {data.iconUrl ? (
                            <Image src={data.iconUrl} alt={data.typeTitle} width={48} height={48} unoptimized />
                        ) : (
                            <span className={styles.emoji}>{data.fallbackEmoji}</span>
                        )}
                    </div>
                    <div className={styles.topInfo}>
                        <div className={styles.typeRow}>
                            <span className={styles.typeTitle}>{data.typeTitle}</span>
                            {data.direction === 'income' && (
                                <span className={`${styles.badge} ${styles.income}`}>Получено</span>
                            )}
                            {data.direction === 'expense' && (
                                <span className={`${styles.badge} ${styles.expense}`}>Отправлено</span>
                            )}
                            {!data.isSuccess && (
                                <span className={`${styles.badge} ${styles.failed}`}>Failed</span>
                            )}
                            {data.isScam && (
                                <span className={`${styles.badge} ${styles.scam}`}>⚠️ Scam</span>
                            )}
                        </div>
                        <span className={`${styles.amount} ${valueClass}`}>{data.displayValue}</span>
                    </div>
                </div>

                <div className={styles.rows}>
                    <div className={styles.row}>
                        <span className={styles.label}>Дата</span>
                        <span className={styles.value}>{data.date} • {data.time}</span>
                    </div>

                    {data.comment && (
                        <div className={styles.row}>
                            <span className={styles.label}>Комментарий</span>
                            <span className={styles.value}>{data.comment}</span>
                        </div>
                    )}

                    {data.senderAddress && (
                        <div className={styles.row}>
                            <span className={styles.label}>От</span>
                            <button
                                className={styles.copyBtn}
                                onClick={() => copy(data.senderAddress!, 'sender')}
                            >
                                <span>{shortAddr(data.senderAddress)}</span>
                                <span className={`${styles.copyIcon} ${copiedField === 'sender' ? styles.copied : ''}`}>
                                    {copiedField === 'sender' ? '✓' : '⧉'}
                                </span>
                            </button>
                        </div>
                    )}

                    {data.recipientAddress && (
                        <div className={styles.row}>
                            <span className={styles.label}>Кому</span>
                            <button
                                className={styles.copyBtn}
                                onClick={() => copy(data.recipientAddress!, 'recipient')}
                            >
                                <span>{shortAddr(data.recipientAddress)}</span>
                                <span className={`${styles.copyIcon} ${copiedField === 'recipient' ? styles.copied : ''}`}>
                                    {copiedField === 'recipient' ? '✓' : '⧉'}
                                </span>
                            </button>
                        </div>
                    )}

                    <div className={styles.row}>
                        <span className={styles.label}>Хэш</span>
                        <button
                            className={styles.copyBtn}
                            onClick={() => copy(data.eventId, 'hash')}
                        >
                            <span>{shortAddr(data.eventId)}</span>
                            <span className={`${styles.copyIcon} ${copiedField === 'hash' ? styles.copied : ''}`}>
                                {copiedField === 'hash' ? '✓' : '⧉'}
                            </span>
                        </button>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <a
                    href={`https://tonscan.org/tx/${data.eventId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.tonscanLink}
                >
                    Открыть в Tonscan →
                </a>
            </Modal.Footer>
        </Modal>
    );
};
