import { mapTransactionEventToView } from './map-transaction';
import type { TransactionEvent } from '../model/types';

const WALLET = 'EQA1234567890abcdefghijklmnopqrstuvwxyz12345678';
const OTHER = 'UQA9876543210zyxwvutsrqponmlkjihgfedcba98765432';

const makeTonEvent = (overrides: Partial<TransactionEvent> = {}): TransactionEvent => ({
    event_id: 'abc123',
    timestamp: 1700000000,
    account: { address: WALLET, is_wallet: true },
    is_scam: false,
    actions: [
        {
            type: 'TonTransfer',
            status: 'ok',
            simple_preview: { name: 'TON Transfer', description: 'Sent TON', value: '1.5 TON' },
            TonTransfer: {
                sender: { address: WALLET, is_wallet: true },
                recipient: { address: OTHER, is_wallet: true },
                amount: 1500000000,
            },
        },
    ],
    ...overrides,
});

describe('mapTransactionEventToView', () => {
    it('returns null for events with no actions', () => {
        const event = makeTonEvent({ actions: [] });
        expect(mapTransactionEventToView(event, WALLET)).toBeNull();
    });

    it('sets direction to expense when sender is wallet', () => {
        const vm = mapTransactionEventToView(makeTonEvent(), WALLET);
        expect(vm?.direction).toBe('expense');
    });

    it('sets direction to income when recipient is wallet', () => {
        const event = makeTonEvent();
        event.actions[0].TonTransfer!.sender.address = OTHER;
        event.actions[0].TonTransfer!.recipient.address = WALLET;
        const vm = mapTransactionEventToView(event, WALLET);
        expect(vm?.direction).toBe('income');
    });

    it('adds "-" prefix for expense', () => {
        const vm = mapTransactionEventToView(makeTonEvent(), WALLET);
        expect(vm?.displayValue).toMatch(/^-/);
    });

    it('adds "+" prefix for income', () => {
        const event = makeTonEvent();
        event.actions[0].TonTransfer!.sender.address = OTHER;
        event.actions[0].TonTransfer!.recipient.address = WALLET;
        const vm = mapTransactionEventToView(event, WALLET);
        expect(vm?.displayValue).toMatch(/^\+/);
    });

    it('propagates isScam from event', () => {
        const event = makeTonEvent({ is_scam: true });
        const vm = mapTransactionEventToView(event, WALLET);
        expect(vm?.isScam).toBe(true);
    });

    it('sets isSuccess=false when action status is failed', () => {
        const event = makeTonEvent();
        event.actions[0].status = 'failed';
        const vm = mapTransactionEventToView(event, WALLET);
        expect(vm?.isSuccess).toBe(false);
    });

    it('fills eventId from event_id', () => {
        const vm = mapTransactionEventToView(makeTonEvent(), WALLET);
        expect(vm?.eventId).toBe('abc123');
    });

    it('extracts comment from TonTransfer', () => {
        const event = makeTonEvent();
        event.actions[0].TonTransfer!.comment = 'hello';
        const vm = mapTransactionEventToView(event, WALLET);
        expect(vm?.comment).toBe('hello');
    });
});
