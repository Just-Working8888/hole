export interface JettonBalanceItem {
    balance: string;
    jetton: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        image: string;
        verification?: 'whitelist' | 'blacklist' | 'none';
    };
}
