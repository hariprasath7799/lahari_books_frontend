import { configureStore, createSlice } from '@reduxjs/toolkit';

// We'll use this later in the User App to control reading modes
const readerSlice = createSlice({
    name: 'reader',
    initialState: { fontSize: 18, theme: 'light' },
    reducers: {
        setFontSize: (state, action) => { state.fontSize = action.payload; },
        setTheme: (state, action) => { state.theme = action.payload; },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        }
    }
});

export const { setFontSize, setTheme, toggleTheme } = readerSlice.actions;

export const store = configureStore({
    reducer: { reader: readerSlice.reducer }
});