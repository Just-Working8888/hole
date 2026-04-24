import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Language, Currency, SettingsState } from './types';

const STORAGE_KEY = 'app_settings';

const getStoredSettings = (): SettingsState => {
    if (typeof window === 'undefined') return { language: 'ru', currency: 'USD' };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : { language: 'ru', currency: 'USD' };
    } catch {
        return { language: 'ru', currency: 'USD' };
    }
};

const saveSettings = (settings: SettingsState) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
};

const initialState: SettingsState = getStoredSettings();

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
            saveSettings({ ...state });
        },
        setCurrency: (state, action: PayloadAction<Currency>) => {
            state.currency = action.payload;
            saveSettings({ ...state });
        },
    },
});

export const { setLanguage, setCurrency } = settingsSlice.actions;
