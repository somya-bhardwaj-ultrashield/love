import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { occupationsApi, type Occupation, type ListOccupationsParams } from "@/api/occupations";

export interface OccupationsState {
  items: Occupation[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  loading: boolean;
  error: string | null;
  lastParams: ListOccupationsParams | null;
}

const initialPagination = { total: 0, page: 1, limit: 10, totalPages: 0 };

const initialState: OccupationsState = {
  items: [],
  pagination: initialPagination,
  loading: false,
  error: null,
  lastParams: null,
};

export const fetchOccupations = createAsyncThunk(
  "occupations/fetchOccupations",
  async (params: ListOccupationsParams | undefined, { rejectWithValue }) => {
    try {
      const res = await occupationsApi.list(params);
      return { data: res.data, pagination: res.pagination };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to load occupations");
    }
  }
);

const occupationsSlice = createSlice({
  name: "occupations",
  initialState,
  reducers: {
    occupationAdded(state, action: PayloadAction<Occupation>) {
      state.items.unshift(action.payload);
      state.pagination.total += 1;
    },
    occupationUpdated(state, action: PayloadAction<Occupation>) {
      const idx = state.items.findIndex((o) => o._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    occupationRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((o) => o._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    clearOccupationsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOccupations.pending, (state, { meta }) => {
        state.loading = true;
        state.error = null;
        state.lastParams = meta.arg ?? null;
      })
      .addCase(fetchOccupations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOccupations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = [];
        state.pagination = { ...initialPagination, total: 0 };
      });
  },
});

export const { occupationAdded, occupationUpdated, occupationRemoved, clearOccupationsError } = occupationsSlice.actions;
export default occupationsSlice.reducer;
