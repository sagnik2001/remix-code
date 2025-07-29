// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import rootReducer from '~/reducers/rootReducer'; // your combineReducers from above
import { baseApi } from '~/services/api';           // if you’re using RTK Query
import { layoutSlice } from './containers/Layout/layoutSlice';

export const store = configureStore({
  reducer: {
    ...rootReducer,
    [baseApi.reducerPath]: baseApi.reducer,
      layout: layoutSlice.reducer,
  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Optionally export typed hooks:
export type AppDispatch = typeof store.dispatch;
export type RootState  = ReturnType<typeof store.getState>;
