import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    address: string | null;
    isAuth: boolean;
}

// Пытаемся достать адрес из памяти браузера
const savedAddress = typeof window !== 'undefined' ? localStorage.getItem('wallet_address') : null;

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
            localStorage.setItem('wallet_address', action.payload); // Сохраняем
        },
        logout: (state) => {
            state.address = null;
            state.isAuth = false;
            localStorage.removeItem('wallet_address');
        },
    },
});

export const { setAddress, logout } = userSlice.actions;
