import { motion } from 'framer-motion';
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

// Mock data
const stats = {
  monthlyRevenue: 12450,
  monthlyRevenueChange: 12.5,
  monthlyExpenses: 3280,
  monthlyExpensesChange: -5.2,
  portfolioValue: 84320,
  portfolioChange: 8.3,
  netProfit: 9170,
  netProfitChange: 18.7,
};

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
  { name: 'Déc', revenue: 12450, expenses: 3280 },
];

const portfolioAssets = [
  { id: '1', name: 'Apple Inc.', symbol: 'AAPL', type: 'stock' as const, value: 25400, change: 5.2, allocation: 30 },
  { id: '2', name: 'Bitcoin', symbol: 'BTC', type: 'crypto' as const, value: 18200, change: 12.8, allocation: 22 },
  { id: '3', name: 'Appartement Paris', symbol: 'IMMO', type: 'real_estate' as const, value: 35000, change: 2.1, allocation: 42 },
  { id: '4', name: 'Ethereum', symbol: 'ETH', type: 'crypto' as const, value: 5720, change: -3.4, allocation: 6 },
];

const goals = [
  { id: '1', title: 'Fonds d\'urgence', targetAmount: 15000, currentAmount: 12500, category: 'savings' as const, deadline: 'Mars 2025' },
  { id: '2', title: 'Chiffre d\'affaires annuel', targetAmount: 150000, currentAmount: 124500, category: 'business' as const, deadline: 'Déc 2024' },
  { id: '3', title: 'Portfolio 100k€', targetAmount: 100000, currentAmount: 84320, category: 'investment' as const, deadline: 'Juin 2025' },
];

const transactions = [
  { id: '1', type: 'revenue' as const, amount: 2500, category: 'Freelance', description: 'Client ABC - Projet web', date: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '2', type: 'expense' as const, amount: 299, category: 'Outils', description: 'Abonnement Figma', date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '3', type: 'revenue' as const, amount: 1800, category: 'Consulting', description: 'Formation React', date: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: '4', type: 'expense' as const, amount: 89, category: 'Marketing', description: 'Google Ads', date: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '5', type: 'revenue' as const, amount: 4200, category: 'Produit', description: 'Vente template', date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
];

const events = [
  { id: '1', title: 'Call client ABC', time: '10:00', location: 'Google Meet', type: 'meeting' as const },
  { id: '2', title: 'Livraison maquettes', time: '14:00', type: 'deadline' as const },
  { id: '3', title: 'Déclaration TVA', time: '18:00', type: 'reminder' as const },
];

export default function Dashboard() {
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
            Bonjour, <span className="gradient-text">Louis</span>
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
          value={stats.monthlyRevenue}
          change={stats.monthlyRevenueChange}
          icon={Wallet}
          delay={0.1}
        />
        <StatCard
          title="Dépenses du mois"
          value={stats.monthlyExpenses}
          change={stats.monthlyExpensesChange}
          icon={Receipt}
          delay={0.15}
        />
        <StatCard
          title="Portfolio"
          value={stats.portfolioValue}
          change={stats.portfolioChange}
          icon={TrendingUp}
          delay={0.2}
        />
        <StatCard
          title="Bénéfice net"
          value={stats.netProfit}
          change={stats.netProfitChange}
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
            totalValue={stats.portfolioValue}
            totalChange={stats.portfolioChange}
          />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions} />
        </div>

        {/* Goals */}
        <div>
          <GoalsWidget goals={goals} />
        </div>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events */}
        <div>
          <UpcomingEvents events={events} currentDate={new Date()} />
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
