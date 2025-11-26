import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type {
  Transaction,
  Investment,
  Goal,
  Project,
  Event,
  TaxObligation,
} from '../types';

// ==================== AUTH HELPERS ====================
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });
}

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });
}

// ==================== TRANSACTIONS ====================
export function useTransactions(limit = 50) {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['transactions', user?.id, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
}

export function useRevenues(limit = 50) {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['revenues', user?.id, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'revenue')
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
}

export function useExpenses(limit = 50) {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['expenses', user?.id, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'expense')
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
}

export function useInsertTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

// ==================== INVESTMENTS ====================
export function useInvestments() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['investments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const investments = data as Investment[];
      return investments.map(inv => ({
        ...inv,
        totalValue: inv.current_price ? inv.quantity * inv.current_price : inv.quantity * inv.buy_price,
        change: inv.current_price ? (inv.current_price - inv.buy_price) * inv.quantity : 0,
        changePercent: inv.current_price ? ((inv.current_price - inv.buy_price) / inv.buy_price) * 100 : 0,
      }));
    },
    enabled: !!user,
  });
}

export function useInsertInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (investment: Omit<Investment, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('investments')
        .insert({ ...investment, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

// ==================== GOALS ====================
export function useGoals() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .neq('status', 'archived')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user,
  });
}

export function useInsertGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert({ ...goal, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

// ==================== PROJECTS ====================
export function useProjects() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
    enabled: !!user,
  });
}

export function useInsertProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'tasks'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert({ ...project, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// ==================== EVENTS ====================
export function useEvents(startDate?: string, endDate?: string) {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['events', user?.id, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (startDate) query = query.gte('start_time', startDate);
      if (endDate) query = query.lte('start_time', endDate);

      const { data, error } = await query;

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user,
  });
}

export function useInsertEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert({ ...event, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// ==================== TAX OBLIGATIONS ====================
export function useTaxObligations() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['taxObligations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_obligations')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as TaxObligation[];
    },
    enabled: !!user,
  });
}

export function useInsertTaxObligation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taxObligation: Omit<TaxObligation, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tax_obligations')
        .insert({ ...taxObligation, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxObligations'] });
    },
  });
}

export function useDeleteTaxObligation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tax_obligations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxObligations'] });
    },
  });
}

// ==================== DASHBOARD STATS ====================
export function useDashboardStats() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];

      // Fetch all data in parallel
      const [currentRevenues, lastRevenues, currentExpenses, lastExpenses, investments] = await Promise.all([
        supabase.from('transactions').select('amount').eq('type', 'revenue').gte('date', startOfMonth),
        supabase.from('transactions').select('amount').eq('type', 'revenue').gte('date', startOfLastMonth).lt('date', startOfMonth),
        supabase.from('transactions').select('amount').eq('type', 'expense').gte('date', startOfMonth),
        supabase.from('transactions').select('amount').eq('type', 'expense').gte('date', startOfLastMonth).lt('date', startOfMonth),
        supabase.from('investments').select('quantity, buy_price, current_price'),
      ]);

      const currentRevenue = currentRevenues.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const lastRevenue = lastRevenues.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const currentExpensesAmount = currentExpenses.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const lastExpensesAmount = lastExpenses.data?.reduce((sum, t) => sum + t.amount, 0) || 0;

      const portfolioValue = investments.data?.reduce((sum, inv) => {
        const price = inv.current_price || inv.buy_price;
        return sum + (price * inv.quantity);
      }, 0) || 0;

      const portfolioCost = investments.data?.reduce((sum, inv) => {
        return sum + (inv.buy_price * inv.quantity);
      }, 0) || 0;

      const portfolioChange = portfolioCost ? ((portfolioValue - portfolioCost) / portfolioCost) * 100 : 0;
      const netProfit = currentRevenue - currentExpensesAmount;
      const lastNetProfit = lastRevenue - lastExpensesAmount;

      return {
        monthlyRevenue: currentRevenue,
        monthlyRevenueChange: lastRevenue ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0,
        monthlyExpenses: currentExpensesAmount,
        monthlyExpensesChange: lastExpensesAmount ? ((currentExpensesAmount - lastExpensesAmount) / lastExpensesAmount) * 100 : 0,
        portfolioValue,
        portfolioChange,
        netProfit,
        netProfitChange: lastNetProfit ? ((netProfit - lastNetProfit) / Math.abs(lastNetProfit)) * 100 : 0,
      };
    },
    enabled: !!user,
  });
}
