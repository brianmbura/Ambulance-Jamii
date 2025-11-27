import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import emergencySlice from './slices/emergencySlice';
import ambulanceSlice from './slices/ambulanceSlice';
import hospitalSlice from './slices/hospitalSlice';
import socketSlice from './slices/socketSlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    emergency: emergencySlice,
    ambulance: ambulanceSlice,
    hospital: hospitalSlice,
    socket: socketSlice,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;