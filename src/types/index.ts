// Enums (correspondant aux types PostgreSQL)
export type InvestmentType = 'stock' | 'crypto' | 'real_estate' | 'other';
export type GoalCategory = 'business' | 'investment' | 'savings';
export type GoalStatus = 'active' | 'completed' | 'archived';
export type ProjectStatus = 'active' | 'completed' | 'archived';
export type ProjectPriority = 'high' | 'medium' | 'low';
export type EventType = 'meeting' | 'deadline' | 'reminder';
export type TransactionType = 'revenue' | 'expense';

// User Profile (Extension de auth.users)
export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  siret?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Transaction (Revenus & Dépenses unifiés)
export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  source?: string;
  merchant?: string;
  description?: string;
  date: string;
  is_recurring: boolean;
  is_deductible: boolean;
  created_at: string;
}

// Types dérivés pour faciliter l'utilisation
export interface Revenue extends Omit<Transaction, 'type' | 'merchant'> {
  type: 'revenue';
}

export interface Expense extends Omit<Transaction, 'type' | 'source'> {
  type: 'expense';
}

// Investment
export interface Investment {
  id: string;
  user_id: string;
  name: string;
  symbol?: string;
  type: InvestmentType;
  quantity: number;
  buy_price: number;
  current_price?: number;
  purchase_date?: string;
  created_at: string;
  // Computed fields
  totalValue?: number;
  change?: number;
  changePercent?: number;
}

// Goal
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  category: GoalCategory;
  deadline?: string;
  status: GoalStatus;
  created_at: string;
}

// Project
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

// Task
export interface Task {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  due_date?: string;
  created_at: string;
}

// Event
export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  type: EventType;
  created_at: string;
}

// Tax Obligation
export interface TaxObligation {
  id: string;
  user_id: string;
  title: string;
  amount?: number;
  due_date: string;
  status: string;
  is_paid: boolean;
  created_at: string;
}

// Dashboard Types
export interface DashboardStats {
  monthlyRevenue: number;
  monthlyRevenueChange: number;
  monthlyExpenses: number;
  monthlyExpensesChange: number;
  portfolioValue: number;
  portfolioChange: number;
  netProfit: number;
  netProfitChange: number;
}

export interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  expenses?: number;
}

// Navigation
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}
