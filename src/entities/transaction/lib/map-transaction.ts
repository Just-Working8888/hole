import type { TransactionEvent, TransactionViewModel } from '../model/types';

const TON_ICON_URL =
    'https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/46db595e47fca18285c42eaa720fd4cdf3cc4940e1490ec07c77d21f2cf961cf.png';

/**
 * Чистая функция: маппит сырой TransactionEvent из TonAPI
 * в плоскую ViewModel, готовую для рендера.
 *
 * Возвращает `null`, если событие невалидно (нет экшенов).
 */
export const mapTransactionEventToView = (
    event: TransactionEvent,
    walletAddress: string,
): TransactionViewModel | null => {
    // Edge-case: пустой массив actions
    if (!event.actions?.length) return null;

    const action = event.actions[0];
    const preview = action.simple_preview;

    // ---------- Дата / время ----------
    const dateObj = new Date(event.timestamp * 1000);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    // ---------- Направление, иконка и детали ----------
    let direction: 'income' | 'expense' | 'neutral' = 'neutral';
    let iconUrl: string | null = null;
    let fallbackEmoji = '⚙️';
    let comment: string | undefined;
    let senderAddress: string | undefined;
    let recipientAddress: string | undefined;

    if (action.type === 'TonTransfer' && action.TonTransfer) {
        const { sender, recipient } = action.TonTransfer;
        if (sender?.address === walletAddress) direction = 'expense';
        if (recipient?.address === walletAddress) direction = 'income';
        iconUrl = TON_ICON_URL;
        fallbackEmoji = '💸';
        comment = action.TonTransfer.comment;
        senderAddress = sender?.address;
        recipientAddress = recipient?.address;
    } else if (action.type === 'JettonTransfer' && action.JettonTransfer) {
        const { sender, recipient } = action.JettonTransfer;
        if (sender?.address === walletAddress) direction = 'expense';
        if (recipient?.address === walletAddress) direction = 'income';
        iconUrl = action.JettonTransfer.jetton?.image ?? null;
        fallbackEmoji = '💸';
        comment = action.JettonTransfer.comment;
        senderAddress = sender?.address ?? undefined;
        recipientAddress = recipient?.address ?? undefined;
    } else if (action.type.includes('Transfer')) {
        fallbackEmoji = '💸';
    }

    // ---------- Форматирование суммы ----------
    let displayValue = preview?.value ?? '';
    const hasSign = displayValue.startsWith('+') || displayValue.startsWith('-');

    if (!hasSign) {
        if (direction === 'income') displayValue = `+${displayValue}`;
        else if (direction === 'expense') displayValue = `-${displayValue}`;
    }

    return {
        id: event.event_id,
        eventId: event.event_id,
        typeTitle: preview?.name || action.type,
        description: preview?.description || 'Детали транзакции скрыты',
        displayValue,
        direction,
        isSuccess: action.status === 'ok',
        isScam: event.is_scam,
        iconUrl,
        fallbackEmoji,
        date,
        time,
        comment,
        senderAddress,
        recipientAddress,
    };
};
