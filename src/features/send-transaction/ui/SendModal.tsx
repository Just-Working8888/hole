'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { useGetJettonBalancesQuery } from '@/shared/api/tonApi';
import { ContactPicker } from '@/features/address-book';
import { buildJettonTransferPayload } from '../lib/buildJettonTransferPayload';
import type { JettonBalanceItem } from '@/entities/jetton/model/balanceTypes';
import { formatJettonBalance } from '@/shared/lib/format-balance';
import styles from './SendModal.module.scss';

interface SendModalProps {
    onClose: () => void;
    maxBalance?: number;
    walletAddress: string;
}

type TokenOption =
    | { type: 'ton' }
    | { type: 'jetton'; item: JettonBalanceItem };

const isValidTonAddress = (addr: string): boolean =>
    /^[EUk][Qf][A-Za-z0-9+/_-]{46}$/.test(addr.trim());

const TON_FEE_FOR_JETTON = '0.1';

export const SendModal = ({ onClose, maxBalance, walletAddress }: SendModalProps) => {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const isConnected = !!wallet;

    const { data: jettonBalances = [] } = useGetJettonBalancesQuery(walletAddress, {
        skip: !walletAddress,
    });
    const nonZeroJettons = jettonBalances.filter((b) => Number(b.balance) > 0);

    const [selectedToken, setSelectedToken] = useState<TokenOption>({ type: 'ton' });
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const isJetton = selectedToken.type === 'jetton';
    const jettonItem = isJetton ? selectedToken.item : null;

    const recipientError =
        recipient && !isValidTonAddress(recipient) ? 'Некорректный TON адрес' : null;

    const amountError = (() => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return amount ? 'Введите корректную сумму' : null;
        }
        if (!isJetton && maxBalance != null && Number(amount) > maxBalance - 0.05) {
            return `Недостаточно средств (макс. ${(maxBalance - 0.05).toFixed(2)} TON)`;
        }
        if (isJetton && jettonItem) {
            const maxJetton = Number(jettonItem.balance) / 10 ** jettonItem.jetton.decimals;
            if (Number(amount) > maxJetton) {
                return `Недостаточно ${jettonItem.jetton.symbol}`;
            }
        }
        return null;
    })();

    const canSubmit =
        isConnected &&
        recipient &&
        isValidTonAddress(recipient) &&
        amount &&
        Number(amount) > 0 &&
        !recipientError &&
        !amountError &&
        !isSubmitting;

    const handleMaxClick = () => {
        if (isJetton && jettonItem) {
            const max = Number(jettonItem.balance) / 10 ** jettonItem.jetton.decimals;
            setAmount(max.toFixed(6).replace(/\.?0+$/, ''));
        } else if (maxBalance != null) {
            setAmount((maxBalance - 0.05).toFixed(2));
        }
    };

    const handleSend = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        setError(null);
        try {
            if (isJetton && jettonItem) {
                // Получаем адрес jetton-кошелька отправителя
                const resp = await fetch(
                    `${process.env.NEXT_PUBLIC_TON_API_URL ?? 'https://tonapi.io/v2'}/accounts/${walletAddress}/jettons/${jettonItem.jetton.address}/wallet`
                );
                if (!resp.ok) throw new Error('Не удалось получить адрес jetton кошелька');
                const { address: jettonWalletAddress } = await resp.json();

                const jettonAmount = BigInt(
                    Math.floor(Number(amount) * 10 ** jettonItem.jetton.decimals)
                );
                const payload = buildJettonTransferPayload({
                    recipientAddress: recipient.trim(),
                    senderAddress: walletAddress,
                    jettonAmount,
                });
                const feeNano = Math.floor(Number(TON_FEE_FOR_JETTON) * 1e9).toString();
                await tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 300,
                    messages: [{ address: jettonWalletAddress, amount: feeNano, payload }],
                });
            } else {
                const amountNano = Math.floor(Number(amount) * 1e9).toString();
                await tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 300,
                    messages: [{ address: recipient.trim(), amount: amountNano }],
                });
            }
            setSuccess(true);
        } catch {
            setError('Транзакция отклонена или произошла ошибка');
        } finally {
            setIsSubmitting(false);
        }
    };

    const tokenLabel = isJetton && jettonItem
        ? `${jettonItem.jetton.symbol}`
        : 'TON';

    if (success) {
        return (
            <Modal onClose={onClose}>
                <Modal.Header title="Отправлено!" />
                <Modal.Body>
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>✓</div>
                        <p>Транзакция успешно отправлена</p>
                        <p className={styles.successSub}>
                            {amount} {tokenLabel} → {recipient.slice(0, 8)}...{recipient.slice(-6)}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className={styles.primaryButton} onClick={onClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal onClose={onClose}>
            <Modal.Header title="Отправить" />
            <Modal.Body>
                {!isConnected && (
                    <div className={styles.connectWarning}>
                        <p>Для отправки необходимо подключить кошелёк через TonConnect</p>
                        <button className={styles.connectButton} onClick={() => tonConnectUI.openModal()}>
                            Подключить кошелёк
                        </button>
                    </div>
                )}

                {/* Выбор токена */}
                <div className={styles.tokenSelector}>
                    <button
                        className={`${styles.tokenOption} ${!isJetton ? styles.tokenActive : ''}`}
                        onClick={() => { setSelectedToken({ type: 'ton' }); setAmount(''); }}
                    >
                        <span className={styles.tonIcon}>💎</span>
                        <span>TON</span>
                    </button>
                    {nonZeroJettons.map((item) => (
                        <button
                            key={item.jetton.address}
                            className={`${styles.tokenOption} ${isJetton && jettonItem?.jetton.address === item.jetton.address ? styles.tokenActive : ''}`}
                            onClick={() => { setSelectedToken({ type: 'jetton', item }); setAmount(''); }}
                        >
                            {item.jetton.image ? (
                                <Image src={item.jetton.image} alt={item.jetton.symbol} width={18} height={18} className={styles.tokenImg} unoptimized />
                            ) : (
                                <span className={styles.tokenFallback}>{item.jetton.symbol.charAt(0)}</span>
                            )}
                            <span>{item.jetton.symbol}</span>
                        </button>
                    ))}
                </div>

                {/* Адрес получателя */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        <span>Адрес получателя</span>
                        <ContactPicker onSelect={(addr) => setRecipient(addr)} />
                    </label>
                    <input
                        className={`${styles.input} ${recipientError ? styles.inputError : ''}`}
                        type="text"
                        placeholder="UQ..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        autoComplete="off"
                    />
                    {recipientError && <span className={styles.fieldError}>{recipientError}</span>}
                </div>

                {/* Сумма */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        <span>Сумма ({tokenLabel})</span>
                        <button className={styles.maxButton} onClick={handleMaxClick}>Макс</button>
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
                    {amountError && <span className={styles.fieldError}>{amountError}</span>}
                    {isJetton && jettonItem && (
                        <span className={styles.balanceHint}>
                            Баланс: {formatJettonBalance(jettonItem.balance, jettonItem.jetton.decimals)} {jettonItem.jetton.symbol}
                        </span>
                    )}
                </div>

                <div className={styles.feeNote}>
                    {isJetton ? `~ ${TON_FEE_FOR_JETTON} TON сетевой сбор` : '~ 0.05 TON сетевой сбор'}
                </div>

                {error && <p className={styles.errorText}>{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button
                    className={`${styles.primaryButton} ${!canSubmit ? styles.disabled : ''}`}
                    onClick={handleSend}
                    disabled={!canSubmit}
                >
                    {isSubmitting ? 'Отправка...' : `Отправить ${tokenLabel}`}
                </button>
            </Modal.Footer>
        </Modal>
    );
};
