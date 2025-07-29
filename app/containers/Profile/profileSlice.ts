import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';

export interface Shop {
  user: User | null;
  isUserfetched: boolean;
}

const initialState: Shop = {
  user: null,
  isUserfetched: false
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isUserfetched = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isUserfetched = true;
    },
    resetUser: (state) => {
      state.user = null;
      state.isUserfetched = false;
    },
    resetProfileSlice: () => initialState
  }
});

export const { setUser, clearUser, resetUser, resetProfileSlice } = profileSlice.actions;
export default profileSlice.reducer;
