import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { usersApi, type AdminUser, type ListUsersParams } from "@/api/users";

export interface UsersState {
  items: AdminUser[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  loading: boolean;
  error: string | null;
  lastParams: ListUsersParams | null;
}

const initialPagination = { total: 0, page: 1, limit: 10, totalPages: 0 };

const initialState: UsersState = {
  items: [],
  pagination: initialPagination,
  loading: false,
  error: null,
  lastParams: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: ListUsersParams | undefined, { rejectWithValue }) => {
    try {
      const res = await usersApi.list(params);
      return { data: res.data, pagination: res.pagination };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to load users");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userAdded(state, action: PayloadAction<AdminUser>) {
      state.items.unshift(action.payload);
      state.pagination.total += 1;
    },
    userUpdated(state, action: PayloadAction<AdminUser>) {
      const idx = state.items.findIndex((u) => u._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    userRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((u) => u._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    clearUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, { meta }) => {
        state.loading = true;
        state.error = null;
        state.lastParams = meta.arg ?? null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = [];
        state.pagination = { ...initialPagination, total: 0 };
      });
  },
});

export const { userAdded, userUpdated, userRemoved, clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
