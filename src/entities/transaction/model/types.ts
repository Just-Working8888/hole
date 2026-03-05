// Строгие типы на основе TonAPI v2 (https://tonapi.io/v2)

export type ActionStatus = 'ok' | 'failed';

export type ActionType =
    | 'TonTransfer'
    | 'JettonTransfer'
    | 'NftItemTransfer'
    | 'SmartContractExec'
    | 'ContractDeploy'
    | 'Subscribe'
    | 'UnSubscribe'
    | 'AuctionBid'
    | 'NftPurchase'
    | 'JettonSwap'
    | 'JettonMint'
    | 'JettonBurn'
    | 'WithdrawStake'
    | 'DepositStake'
    | 'WithdrawStakeRequest'
    | 'Unknown';

export interface AccountAddress {
    address: string;
    name?: string;
    icon?: string;
    is_wallet: boolean;
}

export interface TonTransferAction {
    sender: AccountAddress;
    recipient: AccountAddress;
    amount: number;
    comment?: string;
}

export interface JettonTransferAction {
    sender: AccountAddress | null;
    recipient: AccountAddress | null;
    amount: string;
    comment?: string;
    jetton: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        image?: string;
    };
}

export interface SimplePreview {
    name: string;
    description: string;
    value?: string;
    accounts?: AccountAddress[];
}

export interface TonAction {
    type: ActionType;
    status: ActionStatus;
    simple_preview: SimplePreview;
    TonTransfer?: TonTransferAction;
    JettonTransfer?: JettonTransferAction;
}

export interface TransactionEvent {
    event_id: string;
    timestamp: number;
    account: AccountAddress;
    actions: TonAction[];
    is_scam: boolean;
}

// ViewModel для UI — чистые, готовые к рендеру данные
export interface TransactionViewModel {
    id: string;
    typeTitle: string;
    description: string;
    displayValue: string;
    direction: 'income' | 'expense' | 'neutral';
    isSuccess: boolean;
    iconUrl: string | null;
    fallbackEmoji: string;
    date: string;
    time: string;
}
