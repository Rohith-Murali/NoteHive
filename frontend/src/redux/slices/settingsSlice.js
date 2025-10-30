// src/redux/slices/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // allow 'system' so app can follow OS preference when no explicit choice
  theme: localStorage.getItem("theme") || "system",
  fontSize: localStorage.getItem("fontSize") || "16",
  sortOrder: localStorage.getItem("sortOrder") || "newest",
  notifications: localStorage.getItem("notifications") === "true" || false,
  autoSave: localStorage.getItem("autoSave") === "true" || false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      localStorage.setItem("fontSize", action.payload);
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      localStorage.setItem("sortOrder", action.payload);
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      localStorage.setItem("notifications", action.payload);
    },
    setAutoSave: (state, action) => {
      state.autoSave = action.payload;
      localStorage.setItem("autoSave", action.payload);
    },
    resetSettings: (state) => {
      state.theme = "system";
      state.fontSize = "16";
      state.sortOrder = "newest";
      state.notifications = false;
      state.autoSave = false;
      localStorage.clear();
    },
  },
});

export const {
  setTheme,
  setFontSize,
  setSortOrder,
  setNotifications,
  setAutoSave,
  resetSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
