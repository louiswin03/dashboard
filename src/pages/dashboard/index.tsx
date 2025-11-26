import { motion } from 'framer-motion';
import { useUser } from '../../hooks/useSupabase';
import {
  Wallet,
  Receipt,
  TrendingUp,
  PiggyBank,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import PortfolioWidget from '../../components/dashboard/PortfolioWidget';
import GoalsWidget from '../../components/dashboard/GoalsWidget';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import UpcomingEvents from '../../components/dashboard/UpcomingEvents';
import { Button } from '../../components/common';
import {
  useDashboardStats,
  useTransactions,
  useInvestments,
  useGoals,
  useEvents,
} from '../../hooks/useSupabase';
import { useMemo } from 'react';

export default function Dashboard() {
  const { data: user } = useUser();
  const isAuthenticated = !!user;
  const userName = user?.user_metadata?.first_name || user?.user_metadata?.full_name || 'Entrepreneur';

  // Fetch data
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: transactionsData = [], isLoading: transactionsLoading } = useTransactions(10);
  const { data: investmentsData = [], isLoading: investmentsLoading } = useInvestments();
  const { data: goalsData = [], isLoading: goalsLoading } = useGoals();

  // Get today's events
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  const { data: eventsData = [], isLoading: eventsLoading } = useEvents(startOfDay, endOfDay);

  // Transform investments for portfolio widget
  const portfolioAssets = useMemo(() => {
    const totalValue = investmentsData.reduce((sum, inv) => sum + (inv.totalValue || 0), 0);

    return investmentsData.map(inv => ({
      id: inv.id,
      name: inv.name,
      symbol: inv.symbol || '',
      type: inv.type,
      value: inv.totalValue || 0,
      change: inv.changePercent || 0,
      allocation: totalValue > 0 ? ((inv.totalValue || 0) / totalValue) * 100 : 0,
    }));
  }, [investmentsData]);

  // Transform goals data
  const goalsForWidget = useMemo(() => {
    return goalsData.slice(0, 3).map(goal => ({
      id: goal.id,
      title: goal.title,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      category: goal.category,
      deadline: goal.deadline ? new Date(goal.deadline).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : undefined,
    }));
  }, [goalsData]);

  // Transform transactions data
  const transactionsForWidget = useMemo(() => {
    return transactionsData.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description || (t.type === 'revenue' ? t.source : t.merchant) || '',
      date: new Date(t.date),
    }));
  }, [transactionsData]);

  // Transform events data
  const eventsForWidget = useMemo(() => {
    return eventsData.map(e => ({
      id: e.id,
      title: e.title,
      time: new Date(e.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      location: e.location,
      type: e.type,
    }));
  }, [eventsData]);

  // Mock chart data for now (will need aggregation query)
  const chartData = [
    { name: 'Jan', revenue: 8500, expenses: 3200 },
    { name: 'Fév', revenue: 9200, expenses: 2900 },
    { name: 'Mar', revenue: 7800, expenses: 3100 },
    { name: 'Avr', revenue: 11500, expenses: 3400 },
    { name: 'Mai', revenue: 10200, expenses: 2800 },
    { name: 'Jun', revenue: 9800, expenses: 3000 },
    { name: 'Jul', revenue: 12100, expenses: 3200 },
    { name: 'Aoû', revenue: 11400, expenses: 2900 },
    { name: 'Sep', revenue: 13200, expenses: 3100 },
    { name: 'Oct', revenue: 12800, expenses: 3300 },
    { name: 'Nov', revenue: 11900, expenses: 3100 },
    { name: 'Déc', revenue: stats?.monthlyRevenue || 0, expenses: stats?.monthlyExpenses || 0 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Connexion requise</h2>
          <p className="text-text-secondary">Veuillez vous connecter pour accéder au dashboard</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Hero Section avec Stats Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-surface-50 to-secondary/10 border border-white/10 p-8"
      >
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <motion.p
                className="text-text-muted text-sm uppercase tracking-wider mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Dashboard
              </motion.p>
              <motion.h1
                className="text-4xl md:text-5xl font-display font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Bonjour, {userName}
              </motion.h1>
              <motion.p
                className="text-text-secondary text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Voici votre activité en temps réel
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <Button variant="secondary">
                Exporter
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="primary">
                <Sparkles className="w-4 h-4" />
                Nouvelle entrée
              </Button>
            </motion.div>
          </div>

          {/* Mini Stats dans le Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Revenus', value: formatCurrency(stats?.monthlyRevenue || 0), icon: Wallet, color: 'text-primary' },
              { label: 'Portfolio', value: formatCurrency(stats?.portfolioValue || 0), icon: TrendingUp, color: 'text-secondary' },
              { label: 'Bénéfice', value: formatCurrency(stats?.netProfit || 0), icon: PiggyBank, color: 'text-success' },
              { label: 'Dépenses', value: formatCurrency(stats?.monthlyExpenses || 0), icon: Receipt, color: 'text-warning' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-text-muted text-sm">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Layout - Ledger Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Large Chart - Takes 8 columns on desktop */}
        <motion.div
          className="col-span-12 lg:col-span-8 row-span-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
        >
          <div className="relative group h-full">
            {/* Animated border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-gradient-to-br from-surface-50 to-surface-100 rounded-3xl border border-white/10 overflow-hidden">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-secondary/20 to-transparent rounded-tl-full"></div>
              <RevenueChart data={chartData} />
            </div>
          </div>
        </motion.div>

        {/* Portfolio Widget - Takes 4 columns */}
        <motion.div
          className="col-span-12 lg:col-span-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
        >
          <div className="relative group h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full">
              <PortfolioWidget
                assets={portfolioAssets}
                totalValue={stats?.portfolioValue || 0}
                totalChange={stats?.portfolioChange || 0}
              />
            </div>
          </div>
        </motion.div>

        {/* Goals Widget - Stacked below Portfolio */}
        <motion.div
          className="col-span-12 lg:col-span-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-success/30 to-accent/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <GoalsWidget goals={goalsForWidget} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Second row */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        {/* Transactions */}
        <motion.div
          className="lg:col-span-2"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <RecentTransactions transactions={transactionsForWidget} />
        </motion.div>

        {/* Goals */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <GoalsWidget goals={goalsForWidget} />
        </motion.div>
      </motion.div>

      {/* Third row */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        {/* Events */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <UpcomingEvents events={eventsForWidget} currentDate={new Date()} />
        </motion.div>

        {/* Quick actions or other widgets can go here */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 card p-6 flex items-center justify-center"
        >
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Optimisez votre fiscalité</h3>
            <p className="text-text-secondary mb-4">
              Découvrez des conseils personnalisés pour réduire vos impôts et maximiser vos bénéfices.
            </p>
            <Button variant="primary">
              Analyser ma situation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
