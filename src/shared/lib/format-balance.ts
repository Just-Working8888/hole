// src/shared/lib/format-balance.ts
export const fromNano = (nano: string | number): number => {
    return Number(nano) / 1_000_000_000;
};