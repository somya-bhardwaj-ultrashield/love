import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { interestsApi, type Interest, type ListInterestsParams } from "@/api/interests";

export interface InterestsState {
  items: Interest[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  loading: boolean;
  error: string | null;
  lastParams: ListInterestsParams | null;
}

const initialPagination = { total: 0, page: 1, limit: 10, totalPages: 0 };

const initialState: InterestsState = {
  items: [],
  pagination: initialPagination,
  loading: false,
  error: null,
  lastParams: null,
};

export const fetchInterests = createAsyncThunk(
  "interests/fetchInterests",
  async (params: ListInterestsParams | undefined, { rejectWithValue }) => {
    try {
      const res = await interestsApi.list(params);
      return { data: res.data, pagination: res.pagination };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to load interests");
    }
  }
);

const interestsSlice = createSlice({
  name: "interests",
  initialState,
  reducers: {
    interestAdded(state, action: PayloadAction<Interest>) {
      state.items.unshift(action.payload);
      state.pagination.total += 1;
    },
    interestUpdated(state, action: PayloadAction<Interest>) {
      const idx = state.items.findIndex((i) => i._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    interestRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    clearInterestsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterests.pending, (state, { meta }) => {
        state.loading = true;
        state.error = null;
        state.lastParams = meta.arg ?? null;
      })
      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = [];
        state.pagination = { ...initialPagination, total: 0 };
      });
  },
});

export const { interestAdded, interestUpdated, interestRemoved, clearInterestsError } = interestsSlice.actions;
export default interestsSlice.reducer;
