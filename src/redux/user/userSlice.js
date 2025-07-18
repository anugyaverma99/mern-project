import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  name: null,
  role: null,
  // Add more fields as needed
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    clearUserDetails: (state) => {
      state.email = null;
      state.name = null;
      state.role = null;
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
