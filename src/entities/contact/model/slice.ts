import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Contact, ContactState } from './types';

const STORAGE_KEY = 'wallet_contacts';

const getStoredContacts = (): Contact[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveContacts = (contacts: Contact[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
};

const initialState: ContactState = {
    contacts: getStoredContacts(),
};

export const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        addContact: (state, action: PayloadAction<{ name: string; address: string }>) => {
            const newContact: Contact = {
                id: typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : Math.random().toString(36).slice(2),
                name: action.payload.name,
                address: action.payload.address,
            };
            state.contacts.push(newContact);
            saveContacts(JSON.parse(JSON.stringify(state.contacts)));
        },
        deleteContact: (state, action: PayloadAction<string>) => {
            state.contacts = state.contacts.filter((c) => c.id !== action.payload);
            saveContacts(JSON.parse(JSON.stringify(state.contacts)));
        },
        updateContact: (state, action: PayloadAction<Contact>) => {
            const index = state.contacts.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.contacts[index] = action.payload;
                saveContacts(JSON.parse(JSON.stringify(state.contacts)));
            }
        },
    },
});

export const { addContact, deleteContact, updateContact } = contactSlice.actions;
