// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
}

// Revenue Types
export interface Revenue {
  id: string;
  amount: number;
  category: string;
  source?: string;
  date: Date;
  recurring: boolean;
  description?: string;
}

// Expense Types
export interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant?: string;
  date: Date;
  recurring: boolean;
  deductible: boolean;
  description?: string;
}

// Investment Types
export type InvestmentType = 'stock' | 'crypto' | 'real_estate' | 'other';

export interface Investment {
  id: string;
  type: InvestmentType;
  symbol?: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice?: number;
  totalValue?: number;
  change?: number;
  changePercent?: number;
  lastUpdated?: Date;
  notes?: string;
}

// Goal Types
export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category: 'business' | 'investment' | 'savings';
  status: 'active' | 'completed' | 'archived';
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  priority?: 'high' | 'medium' | 'low';
  dueDate?: Date;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  allDay: boolean;
  reminder?: Date;
  location?: string;
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
