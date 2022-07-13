import { createSlice } from "@reduxjs/toolkit";
import storage from "../utils/storage";

const authSlice = createSlice({
  name: "auth",
  initialState: () => {
    const storedState = storage.getItem("auth");
    console.log(storedState)
    if (storedState) {
      return storedState;
    } else {
      return {
        isLoggedIn: false,
        id: "",
      };
    }
  },
  reducers: {
    onLoginSuccess(state, action) {
      const { id, image, token, username, header } = action.payload;
      state.id = id;
      state.isLoggedIn = true;
      storage.setItem("auth", {...action.payload, isLoggedIn: true});
    },
    logout(state, action) {
      const todo = state.find((todo) => todo.id === action.payload);
      todo.completed = !todo.completed;
    },
  },
});

export const { onLoginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
