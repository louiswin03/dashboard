import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserId } from '@nhost/react';
import { nhost } from '../lib/nhost';
import * as queries from '../graphql/queries';
import type {
  Profile,
  Transaction,
  Investment,
  Goal,
  Project,
  Event,
  TaxObligation,
} from '../types';

// ==================== PROFILE ====================
export function useProfile() {
  const userId = useUserId();

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await nhost.graphql.request<{ profiles_by_pk: Profile }>(
        queries.GET_PROFILE,
        { userId }
      );
      if (error) throw error;
      return data?.profiles_by_pk || null;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await nhost.graphql.request(
        queries.UPDATE_PROFILE,
        { userId, data: profileData }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}

// ==================== TRANSACTIONS ====================
export function useTransactions(limit = 50, offset = 0) {
  const userId = useUserId();

  return useQuery({
    queryKey: ['transactions', userId, limit, offset],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ transactions: Transaction[] }>(
        queries.GET_TRANSACTIONS,
        { userId, limit, offset }
      );
      if (error) throw error;
      return data?.transactions || [];
    },
    enabled: !!userId,
  });
}

export function useRevenues(limit = 50) {
  const userId = useUserId();

  return useQuery({
    queryKey: ['revenues', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ transactions: Transaction[] }>(
        queries.GET_REVENUES,
        { userId, limit }
      );
      if (error) throw error;
      return data?.transactions || [];
    },
    enabled: !!userId,
  });
}

export function useExpenses(limit = 50) {
  const userId = useUserId();

  return useQuery({
    queryKey: ['expenses', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ transactions: Transaction[] }>(
        queries.GET_EXPENSES,
        { userId, limit }
      );
      if (error) throw error;
      return data?.transactions || [];
    },
    enabled: !!userId,
  });
}

export function useInsertTransaction() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await nhost.graphql.request(
        queries.INSERT_TRANSACTION,
        { data: { ...transactionData, user_id: userId } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['revenues', userId] });
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats', userId] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await nhost.graphql.request(
        queries.DELETE_TRANSACTION,
        { id }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['revenues', userId] });
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats', userId] });
    },
  });
}

// ==================== INVESTMENTS ====================
export function useInvestments() {
  const userId = useUserId();

  return useQuery({
    queryKey: ['investments', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ investments: Investment[] }>(
        queries.GET_INVESTMENTS,
        { userId }
      );
      if (error) throw error;

      // Calculer les valeurs dérivées
      const investments = data?.investments || [];
      return investments.map(inv => ({
        ...inv,
        totalValue: inv.current_price ? inv.quantity * inv.current_price : inv.quantity * inv.buy_price,
        change: inv.current_price ? (inv.current_price - inv.buy_price) * inv.quantity : 0,
        changePercent: inv.current_price ? ((inv.current_price - inv.buy_price) / inv.buy_price) * 100 : 0,
      }));
    },
    enabled: !!userId,
  });
}

export function useInsertInvestment() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (investmentData: Omit<Investment, 'id' | 'user_id' | 'created_at'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await nhost.graphql.request(
        queries.INSERT_INVESTMENT,
        { data: { ...investmentData, user_id: userId } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats', userId] });
    },
  });
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await nhost.graphql.request(
        queries.DELETE_INVESTMENT,
        { id }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats', userId] });
    },
  });
}

// ==================== GOALS ====================
export function useGoals() {
  const userId = useUserId();

  return useQuery({
    queryKey: ['goals', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ goals: Goal[] }>(
        queries.GET_GOALS,
        { userId }
      );
      if (error) throw error;
      return data?.goals || [];
    },
    enabled: !!userId,
  });
}

export function useInsertGoal() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await nhost.graphql.request(
        queries.INSERT_GOAL,
        { data: { ...goalData, user_id: userId } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });
}

export function useUpdateGoalProgress() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async ({ id, currentAmount }: { id: string; currentAmount: number }) => {
      const { data, error } = await nhost.graphql.request(
        queries.UPDATE_GOAL_PROGRESS,
        { id, currentAmount }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await nhost.graphql.request(
        queries.DELETE_GOAL,
        { id }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });
}

// ==================== PROJECTS ====================
export function useProjects() {
  const userId = useUserId();

  return useQuery({
    queryKey: ['projects', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ projects: Project[] }>(
        queries.GET_PROJECTS,
        { userId }
      );
      if (error) throw error;
      return data?.projects || [];
    },
    enabled: !!userId,
  });
}

export function useInsertProject() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'tasks'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await nhost.graphql.request(
        queries.INSERT_PROJECT,
        { data: { ...projectData, user_id: userId } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async ({ id, projectData }: { id: string; projectData: Partial<Project> }) => {
      const { data, error } = await nhost.graphql.request(
        queries.UPDATE_PROJECT,
        { id, data: projectData }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await nhost.graphql.request(
        queries.DELETE_PROJECT,
        { id }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });
}

// ==================== EVENTS ====================
export function useEvents(startDate?: string, endDate?: string) {
  const userId = useUserId();

  return useQuery({
    queryKey: ['events', userId, startDate, endDate],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ events: Event[] }>(
        queries.GET_EVENTS,
        { userId, startDate, endDate }
      );
      if (error) throw error;
      return data?.events || [];
    },
    enabled: !!userId,
  });
}

export function useInsertEvent() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'user_id' | 'created_at'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await nhost.graphql.request(
        queries.INSERT_EVENT,
        { data: { ...eventData, user_id: userId } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async ({ id, eventData }: { id: string; eventData: Partial<Event> }) => {
      const { data, error } = await nhost.graphql.request(
        queries.UPDATE_EVENT,
        { id, data: eventData }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await nhost.graphql.request(
        queries.DELETE_EVENT,
        { id }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] });
    },
  });
}

// ==================== TAX OBLIGATIONS ====================
export function useTaxObligations() {
  const userId = useUserId();

  return useQuery({
    queryKey: ['taxObligations', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await nhost.graphql.request<{ tax_obligations: TaxObligation[] }>(
        queries.GET_TAX_OBLIGATIONS,
        { userId }
      );
      if (error) throw error;
      return data?.tax_obligations || [];
    },
    enabled: !!userId,
  });
}

export function useInsertTaxObligation() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (taxData: Omit<TaxObligation, 'id' | 'user_id' | 'created_at'>) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await nhost.graphql.request(
        queries.INSERT_TAX_OBLIGATION,
        { data: { ...taxData, user_id: userId } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxObligations', userId] });
    },
  });
}

export function useUpdateTaxObligation() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async ({ id, taxData }: { id: string; taxData: Partial<TaxObligation> }) => {
      const { data, error } = await nhost.graphql.request(
        queries.UPDATE_TAX_OBLIGATION,
        { id, data: taxData }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxObligations', userId] });
    },
  });
}

export function useDeleteTaxObligation() {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await nhost.graphql.request(
        queries.DELETE_TAX_OBLIGATION,
        { id }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxObligations', userId] });
    },
  });
}

// ==================== DASHBOARD STATS ====================
export function useDashboardStats() {
  const userId = useUserId();

  return useQuery({
    queryKey: ['dashboardStats', userId],
    queryFn: async () => {
      if (!userId) return null;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];

      const { data, error } = await nhost.graphql.request<{
        currentMonthRevenues: { aggregate: { sum: { amount: number } } };
        lastMonthRevenues: { aggregate: { sum: { amount: number } } };
        currentMonthExpenses: { aggregate: { sum: { amount: number } } };
        lastMonthExpenses: { aggregate: { sum: { amount: number } } };
        investments: Investment[];
      }>(queries.GET_DASHBOARD_STATS, { userId, startOfMonth, startOfLastMonth });

      if (error) throw error;

      const currentRevenue = data?.currentMonthRevenues?.aggregate?.sum?.amount || 0;
      const lastRevenue = data?.lastMonthRevenues?.aggregate?.sum?.amount || 0;
      const currentExpenses = data?.currentMonthExpenses?.aggregate?.sum?.amount || 0;
      const lastExpenses = data?.lastMonthExpenses?.aggregate?.sum?.amount || 0;

      const portfolioValue = data?.investments?.reduce((sum, inv) => {
        const price = inv.current_price || inv.buy_price;
        return sum + (price * inv.quantity);
      }, 0) || 0;

      const portfolioCost = data?.investments?.reduce((sum, inv) => {
        return sum + (inv.buy_price * inv.quantity);
      }, 0) || 0;

      const portfolioChange = portfolioValue - portfolioCost;
      const netProfit = currentRevenue - currentExpenses;
      const lastNetProfit = lastRevenue - lastExpenses;

      return {
        monthlyRevenue: currentRevenue,
        monthlyRevenueChange: lastRevenue ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0,
        monthlyExpenses: currentExpenses,
        monthlyExpensesChange: lastExpenses ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0,
        portfolioValue,
        portfolioChange: portfolioCost ? (portfolioChange / portfolioCost) * 100 : 0,
        netProfit,
        netProfitChange: lastNetProfit ? ((netProfit - lastNetProfit) / Math.abs(lastNetProfit)) * 100 : 0,
      };
    },
    enabled: !!userId,
  });
}
