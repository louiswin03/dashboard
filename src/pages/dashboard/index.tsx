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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-display font-semibold">
            Bonjour, <span className="gradient-text">{userName || 'Entrepreneur'}</span>
          </h1>
          <p className="text-text-secondary mt-1">
            Voici un aperçu de votre activité ce mois-ci
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenus du mois"
          value={stats?.monthlyRevenue || 0}
          change={stats?.monthlyRevenueChange || 0}
          icon={Wallet}
          delay={0.1}
        />
        <StatCard
          title="Dépenses du mois"
          value={stats?.monthlyExpenses || 0}
          change={stats?.monthlyExpensesChange || 0}
          icon={Receipt}
          delay={0.15}
        />
        <StatCard
          title="Portfolio"
          value={stats?.portfolioValue || 0}
          change={stats?.portfolioChange || 0}
          icon={TrendingUp}
          delay={0.2}
        />
        <StatCard
          title="Bénéfice net"
          value={stats?.netProfit || 0}
          change={stats?.netProfitChange || 0}
          icon={PiggyBank}
          delay={0.25}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Chart */}
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} />
        </div>

        {/* Right column - Portfolio */}
        <div>
          <PortfolioWidget
            assets={portfolioAssets}
            totalValue={stats?.portfolioValue || 0}
            totalChange={stats?.portfolioChange || 0}
          />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactionsForWidget} />
        </div>

        {/* Goals */}
        <div>
          <GoalsWidget goals={goalsForWidget} />
        </div>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events */}
        <div>
          <UpcomingEvents events={eventsForWidget} currentDate={new Date()} />
        </div>

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
      </div>
    </div>
  );
}
