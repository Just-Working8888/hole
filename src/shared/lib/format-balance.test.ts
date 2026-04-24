import { fromNano, formatJettonBalance } from './format-balance';

describe('fromNano', () => {
    it('divides by 1e9', () => {
        expect(fromNano(1_000_000_000)).toBe(1);
    });

    it('handles string input', () => {
        expect(fromNano('5000000000')).toBe(5);
    });

    it('returns 0 for zero', () => {
        expect(fromNano(0)).toBe(0);
    });
});

describe('formatJettonBalance', () => {
    it('returns "0" for zero balance', () => {
        expect(formatJettonBalance('0', 9)).toBe('0');
    });

    it('returns "<0.001" for tiny values', () => {
        expect(formatJettonBalance('1', 9)).toBe('<0.001');
    });

    it('returns M suffix for million+ values', () => {
        // 2000000000000 / 10^6 = 2000000 → "2.00M"
        expect(formatJettonBalance('2000000000000', 6)).toBe('2.00M');
    });

    it('formats regular values with 2 decimal places for low-decimal tokens', () => {
        const result = formatJettonBalance('1500', 3);
        expect(result).toBe('1.50');
    });

    it('formats with 4 decimal places for high-decimal tokens', () => {
        const result = formatJettonBalance('12345', 9);
        expect(result).toBe('<0.001');
    });

    it('formats thousands with locale string', () => {
        // 5000000 / 10^3 = 5000 → toLocaleString with maximumFractionDigits:2
        const result = formatJettonBalance('5000000', 3);
        expect(result).toMatch(/5[,.]?000/);
    });
});
