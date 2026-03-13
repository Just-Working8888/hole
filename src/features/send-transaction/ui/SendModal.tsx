'use client';

import { useState } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Modal } from '@/shared/ui/Modal/Modal';
import styles from './SendModal.module.scss';

interface SendModalProps {
    onClose: () => void;
    maxBalance?: number;
}

const isValidTonAddress = (addr: string): boolean =>
    /^[EUk][Qf][A-Za-z0-9+/_-]{46}$/.test(addr.trim());

export const SendModal = ({ onClose, maxBalance }: SendModalProps) => {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const isConnected = !!wallet;

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const recipientError =
        recipient && !isValidTonAddress(recipient) ? 'Некорректный TON адрес' : null;

    const amountError =
        amount && (isNaN(Number(amount)) || Number(amount) <= 0)
            ? 'Введите корректную сумму'
            : amount && maxBalance != null && Number(amount) > maxBalance - 0.05
            ? `Недостаточно средств (макс. ${(maxBalance - 0.05).toFixed(2)} TON)`
            : null;

    const canSubmit =
        isConnected &&
        recipient &&
        isValidTonAddress(recipient) &&
        amount &&
        Number(amount) > 0 &&
        !recipientError &&
        !amountError &&
        !isSubmitting;

    const handleSend = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const amountNano = Math.floor(Number(amount) * 1e9).toString();
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [{ address: recipient.trim(), amount: amountNano }],
            });
            setSuccess(true);
        } catch {
            setError('Транзакция отклонена или произошла ошибка');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <Modal onClose={onClose}>
                <Modal.Header title="Отправлено!" />
                <Modal.Body>
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>✓</div>
                        <p>Транзакция успешно отправлена</p>
                        <p className={styles.successSub}>
                            {amount} TON → {recipient.slice(0, 8)}...{recipient.slice(-6)}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className={styles.primaryButton} onClick={onClose}>
                        Закрыть
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal onClose={onClose}>
            <Modal.Header title="Отправить TON" />
            <Modal.Body>
                {!isConnected && (
                    <div className={styles.connectWarning}>
                        <p>Для отправки необходимо подключить кошелёк через TonConnect</p>
                        <button
                            className={styles.connectButton}
                            onClick={() => tonConnectUI.openModal()}
                        >
                            Подключить кошелёк
                        </button>
                    </div>
                )}

                <div className={styles.field}>
                    <label className={styles.label}>Адрес получателя</label>
                    <input
                        className={`${styles.input} ${recipientError ? styles.inputError : ''}`}
                        type="text"
                        placeholder="UQ..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        autoComplete="off"
                    />
                    {recipientError && (
                        <span className={styles.fieldError}>{recipientError}</span>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>
                        <span>Сумма (TON)</span>
                        {maxBalance != null && (
                            <button
                                className={styles.maxButton}
                                onClick={() => setAmount((maxBalance - 0.05).toFixed(2))}
                            >
                                Макс
                            </button>
                        )}
                    </label>
                    <input
                        className={`${styles.input} ${amountError ? styles.inputError : ''}`}
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    {amountError && (
                        <span className={styles.fieldError}>{amountError}</span>
                    )}
                </div>

                <div className={styles.feeNote}>~ 0.05 TON сетевой сбор</div>

                {error && <p className={styles.errorText}>{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button
                    className={`${styles.primaryButton} ${!canSubmit ? styles.disabled : ''}`}
                    onClick={handleSend}
                    disabled={!canSubmit}
                >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>
            </Modal.Footer>
        </Modal>
    );
};
