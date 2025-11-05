import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Plan, PlansState } from '../types';
import { fetchPlans, fetchPlanById, createPlan, updatePlan, deletePlan } from '../apis';

const initialState: PlansState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
  filters: {},
};

export const getPlans = createAsyncThunk(
  'plans/getPlans',
  async (filters?: PlansState['filters']) => {
    const response = await fetchPlans(filters);
    return response;
  }
);

export const getPlanById = createAsyncThunk(
  'plans/getPlanById',
  async (id: string) => {
    const response = await fetchPlanById(id);
    return response;
  }
);

export const addPlan = createAsyncThunk(
  'plans/addPlan',
  async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await createPlan(planData);
    return response;
  }
);

export const editPlan = createAsyncThunk(
  'plans/editPlan',
  async ({ id, data }: { id: string; data: Partial<Plan> }) => {
    const response = await updatePlan(id, data);
    return response;
  }
);

export const removePlan = createAsyncThunk(
  'plans/removePlan',
  async (id: string) => {
    await deletePlan(id);
    return id;
  }
);

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PlansState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Plans
      .addCase(getPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plans';
      })
      // Get Plan By Id
      .addCase(getPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(getPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plan';
      })
      // Add Plan
      .addCase(addPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.unshift(action.payload);
      })
      .addCase(addPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create plan';
      })
      // Edit Plan
      .addCase(editPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPlan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        if (state.currentPlan?.id === action.payload.id) {
          state.currentPlan = action.payload;
        }
      })
      .addCase(editPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update plan';
      })
      // Remove Plan
      .addCase(removePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter(p => p.id !== action.payload);
        if (state.currentPlan?.id === action.payload) {
          state.currentPlan = null;
        }
      })
      .addCase(removePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete plan';
      });
  },
});

export const { setFilters, clearFilters, clearCurrentPlan, clearError } = plansSlice.actions;
export default plansSlice.reducer;