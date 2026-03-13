import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    address: string | null;
    isAuth: boolean;
}

// ✅ Безопасное чтение localStorage — только на клиенте
const getStoredAddress = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('wallet_address');
};

const savedAddress = getStoredAddress();

const initialState: UserState = {
    address: savedAddress,
    isAuth: !!savedAddress,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
            state.isAuth = true;
            if (typeof window !== 'undefined') {
                localStorage.setItem('wallet_address', action.payload);
            }
        },
        logout: (state) => {
            state.address = null;
            state.isAuth = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('wallet_address');
            }
        },
    },
});

export const { setAddress, logout } = userSlice.actions;
