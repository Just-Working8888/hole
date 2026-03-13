// src/shared/lib/format-balance.ts
export const fromNano = (nano: string | number): number => {
    return Number(nano) / 1_000_000_000;
};

export const formatJettonBalance = (balance: string, decimals: number): string => {
    const num = Number(balance) / Math.pow(10, decimals);
    if (num === 0) return '0';
    if (num < 0.001) return '<0.001';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return num.toFixed(decimals > 6 ? 4 : 2);
};