import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ReelState {
  feedReels: any[];
}

const initialState: ReelState = {
  feedReels: [],
};

export const reelSlice = createSlice({
  name: 'reel',
  initialState,
  reducers: {
    setFeedReels: (state, action: PayloadAction<any[]>) => {
      state.feedReels = action.payload;
    },
  },
});

export const { setFeedReels } = reelSlice.actions;

export const selectFeedReels = (state: RootState) => state.reel.feedReels;

export default reelSlice.reducer; 