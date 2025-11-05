import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, SubscriptionsState, SubscriptionFormData } from '../types';
import {
  fetchSubscriptions,
  fetchSubscriptionById,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  deleteSubscription
} from '../apis';

const initialState: SubscriptionsState = {
  subscriptions: [],
  currentSubscription: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  },
};

export const getSubscriptions = createAsyncThunk(
  'subscriptions/getSubscriptions',
  async ({
    filters,
    page = 1,
    perPage = 15
  }: {
    filters?: SubscriptionsState['filters'];
    page?: number;
    perPage?: number;
  }) => {
    const response = await fetchSubscriptions(filters, page, perPage);
    return response;
  }
);

export const getSubscriptionById = createAsyncThunk(
  'subscriptions/getSubscriptionById',
  async (id: string) => {
    const response = await fetchSubscriptionById(id);
    return response;
  }
);

export const addSubscription = createAsyncThunk(
  'subscriptions/addSubscription',
  async (subscriptionData: SubscriptionFormData) => {
    const response = await createSubscription(subscriptionData);
    return response;
  }
);

export const editSubscription = createAsyncThunk(
  'subscriptions/editSubscription',
  async ({ id, data }: { id: string; data: Partial<Subscription> }) => {
    const response = await updateSubscription(id, data);
    return response;
  }
);

export const cancelSubscriptionAction = createAsyncThunk(
  'subscriptions/cancelSubscription',
  async (id: string) => {
    const response = await cancelSubscription(id);
    return response;
  }
);

export const renewSubscriptionAction = createAsyncThunk(
  'subscriptions/renewSubscription',
  async (id: string) => {
    const response = await renewSubscription(id);
    return response;
  }
);

export const removeSubscription = createAsyncThunk(
  'subscriptions/removeSubscription',
  async (id: string) => {
    await deleteSubscription(id);
    return id;
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SubscriptionsState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentSubscription: (state) => {
      state.currentSubscription = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.current_page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Subscriptions
      .addCase(getSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscriptions';
      })
      // Get Subscription By Id
      .addCase(getSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(getSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscription';
      })
      // Add Subscription
      .addCase(addSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions.unshift(action.payload);
      })
      .addCase(addSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create subscription';
      })
      // Edit Subscription
      .addCase(editSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      })
      .addCase(editSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update subscription';
      })
      // Cancel Subscription
      .addCase(cancelSubscriptionAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscriptionAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      })
      .addCase(cancelSubscriptionAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cancel subscription';
      })
      // Renew Subscription
      .addCase(renewSubscriptionAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renewSubscriptionAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      })
      .addCase(renewSubscriptionAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to renew subscription';
      })
      // Remove Subscription
      .addCase(removeSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = state.subscriptions.filter(s => s.id !== action.payload);
        if (state.currentSubscription?.id === action.payload) {
          state.currentSubscription = null;
        }
      })
      .addCase(removeSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete subscription';
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentSubscription,
  clearError,
  setPage
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;