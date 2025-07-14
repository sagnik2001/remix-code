// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '~/reducers/rootReducer'; // your combineReducers from above
import { baseApi } from '~/services/api';           // if you’re using RTK Query

export const store = configureStore({
  reducer: {
    ...rootReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Optionally export typed hooks:
export type AppDispatch = typeof store.dispatch;
export type RootState  = ReturnType<typeof store.getState>;
