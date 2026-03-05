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

    // ---------- Направление и иконка ----------
    let direction: 'income' | 'expense' | 'neutral' = 'neutral';
    let iconUrl: string | null = null;
    let fallbackEmoji = '⚙️';

    if (action.type === 'TonTransfer' && action.TonTransfer) {
        const { sender, recipient } = action.TonTransfer;
        if (sender?.address === walletAddress) direction = 'expense';
        if (recipient?.address === walletAddress) direction = 'income';
        iconUrl = TON_ICON_URL;
        fallbackEmoji = '💸';
    } else if (action.type === 'JettonTransfer' && action.JettonTransfer) {
        const { sender, recipient } = action.JettonTransfer;
        if (sender?.address === walletAddress) direction = 'expense';
        if (recipient?.address === walletAddress) direction = 'income';
        iconUrl = action.JettonTransfer.jetton?.image ?? null;
        fallbackEmoji = '💸';
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
        typeTitle: preview?.name || action.type,
        description: preview?.description || 'Детали транзакции скрыты',
        displayValue,
        direction,
        isSuccess: action.status === 'ok',
        iconUrl,
        fallbackEmoji,
        date,
        time,
    };
};
