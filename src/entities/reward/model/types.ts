export interface Reward {
    id: string;
    amount: number;
    type: 'coin' | 'gem';
}

export type RewardIcons = { [K in Reward['type']]: string }