import axios from 'axios';
import { Plan, PlansState } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchPlans = async (filters?: PlansState['filters']): Promise<Plan[]> => {
  const params = new URLSearchParams();

  if (filters?.billing_cycle) {
    params.append('billing_cycle', filters.billing_cycle);
  }
  if (filters?.is_active !== undefined) {
    params.append('is_active', filters.is_active.toString());
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }

  const response = await axios.get(`${API_BASE_URL}/admin/plans?${params.toString()}`);
  return response.data.data || response.data;
};

export const fetchPlanById = async (id: string): Promise<Plan> => {
  const response = await axios.get(`${API_BASE_URL}/admin/plans/${id}`);
  return response.data.data || response.data;
};

export const createPlan = async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan> => {
  const response = await axios.post(`${API_BASE_URL}/admin/plans`, planData);
  return response.data.data || response.data;
};

export const updatePlan = async (id: string, planData: Partial<Plan>): Promise<Plan> => {
  const response = await axios.put(`${API_BASE_URL}/admin/plans/${id}`, planData);
  return response.data.data || response.data;
};

export const deletePlan = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/admin/plans/${id}`);
};