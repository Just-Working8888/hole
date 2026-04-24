import { contactSlice, addContact, deleteContact, updateContact } from './slice';

const reducer = contactSlice.reducer;

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('contactSlice', () => {
    beforeEach(() => localStorageMock.clear());

    it('starts with empty contacts', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state.contacts).toHaveLength(0);
    });

    it('addContact creates a new contact with a generated id', () => {
        let state = reducer({ contacts: [] }, addContact({ name: 'Alice', address: 'EQA1234567890abcdef' }));
        expect(state.contacts).toHaveLength(1);
        expect(state.contacts[0].name).toBe('Alice');
        expect(state.contacts[0].id).toBeDefined();
    });

    it('addContact persists to localStorage', () => {
        reducer({ contacts: [] }, addContact({ name: 'Bob', address: 'UQA9876543210zyxwvu' }));
        const stored = JSON.parse(localStorageMock.getItem('wallet_contacts') ?? '[]');
        expect(stored[0].name).toBe('Bob');
    });

    it('deleteContact removes the correct contact and leaves others', () => {
        const initial = {
            contacts: [
                { id: '1', name: 'Alice', address: 'addr1' },
                { id: '2', name: 'Bob', address: 'addr2' },
            ],
        };
        const state = reducer(initial, deleteContact('1'));
        expect(state.contacts).toHaveLength(1);
        expect(state.contacts[0].id).toBe('2');
    });

    it('updateContact modifies the correct entry', () => {
        const initial = {
            contacts: [{ id: '1', name: 'Alice', address: 'addr1' }],
        };
        const state = reducer(initial, updateContact({ id: '1', name: 'Alicia', address: 'addr1' }));
        expect(state.contacts[0].name).toBe('Alicia');
    });

    it('updateContact does not change other contacts', () => {
        const initial = {
            contacts: [
                { id: '1', name: 'Alice', address: 'addr1' },
                { id: '2', name: 'Bob', address: 'addr2' },
            ],
        };
        const state = reducer(initial, updateContact({ id: '1', name: 'Alicia', address: 'addr1' }));
        expect(state.contacts[1].name).toBe('Bob');
    });
});
