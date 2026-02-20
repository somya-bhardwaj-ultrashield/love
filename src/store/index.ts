import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import interestsReducer from "./slices/interestsSlice";
import occupationsReducer from "./slices/occupationsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    interests: interestsReducer,
    occupations: occupationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
