import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  Users,
  Repeat,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/common';
import TransactionForm from '../../components/forms/TransactionForm';
import { useRevenues } from '../../hooks/useSupabase';
import { cn, formatCurrency, formatDate, formatPercent } from '../../utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data
const monthlyData = [
  { name: 'Jan', value: 8500 },
  { name: 'Fév', value: 9200 },
  { name: 'Mar', value: 7800 },
  { name: 'Avr', value: 11500 },
  { name: 'Mai', value: 10200 },
  { name: 'Jun', value: 9800 },
  { name: 'Jul', value: 12100 },
  { name: 'Aoû', value: 11400 },
  { name: 'Sep', value: 13200 },
  { name: 'Oct', value: 12800 },
  { name: 'Nov', value: 11900 },
  { name: 'Déc', value: 12450 },
];

const categoryData = [
  { name: 'Freelance', value: 45000, color: '#c9a962' },
  { name: 'Consulting', value: 28000, color: '#22c55e' },
  { name: 'Produits', value: 18500, color: '#3b82f6' },
  { name: 'Formation', value: 12000, color: '#a855f7' },
  { name: 'Autres', value: 5500, color: '#71717a' },
];

const revenues = [
  { id: '1', source: 'Client ABC', category: 'Freelance', amount: 2500, date: new Date('2024-12-15'), recurring: false, description: 'Projet web e-commerce' },
  { id: '2', source: 'Tech Corp', category: 'Consulting', amount: 4200, date: new Date('2024-12-12'), recurring: true, description: 'Audit technique mensuel' },
  { id: '3', source: 'Formation React', category: 'Formation', amount: 1800, date: new Date('2024-12-10'), recurring: false, description: 'Workshop 2 jours' },
  { id: '4', source: 'Template Store', category: 'Produits', amount: 890, date: new Date('2024-12-08'), recurring: false, description: 'Vente templates UI' },
  { id: '5', source: 'Startup XYZ', category: 'Freelance', amount: 3500, date: new Date('2024-12-05'), recurring: false, description: 'Développement app mobile' },
  { id: '6', source: 'BigCo', category: 'Consulting', amount: 5000, date: new Date('2024-12-01'), recurring: true, description: 'Advisory retainer' },
];

const stats = [
  { label: 'Ce mois', value: 12450, change: 12.5, icon: Calendar },
  { label: 'Année en cours', value: 124850, change: 18.3, icon: TrendingUp },
  { label: 'Clients actifs', value: 8, change: 2, icon: Users, format: 'number' },
  { label: 'Revenus récurrents', value: 9200, change: 5.2, icon: Repeat },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-50 border border-white/10 rounded-xl p-3 shadow-elevated">
        <p className="text-sm font-medium">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Revenus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch revenues
  const { data: revenuesData = [], isLoading } = useRevenues(100);

  // Calculate stats and chart data
  const { monthlyData, categoryData, stats } = useMemo(() => {
    if (!revenuesData.length) {
      return {
        monthlyData: [],
        categoryData: [],
        stats: {
          thisMonth: 0,
          thisMonthChange: 0,
          yearToDate: 0,
          yearToDateChange: 0,
          activeClients: 0,
          activeClientsChange: 0,
          recurring: 0,
          recurringChange: 0,
        },
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // This month revenues
    const thisMonthRevenues = revenuesData.filter(r => {
      const date = new Date(r.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const thisMonth = thisMonthRevenues.reduce((sum, r) => sum + r.amount, 0);

    // Last month revenues for comparison
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthRevenues = revenuesData.filter(r => {
      const date = new Date(r.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });
    const lastMonthAmount = lastMonthRevenues.reduce((sum, r) => sum + r.amount, 0);
    const thisMonthChange = lastMonthAmount ? ((thisMonth - lastMonthAmount) / lastMonthAmount) * 100 : 0;

    // Year to date
    const yearToDate = revenuesData
      .filter(r => new Date(r.date).getFullYear() === currentYear)
      .reduce((sum, r) => sum + r.amount, 0);

    // Active clients (unique sources this month)
    const activeClients = new Set(thisMonthRevenues.map(r => r.source).filter(Boolean)).size;

    // Recurring revenues
    const recurring = thisMonthRevenues
      .filter(r => r.is_recurring)
      .reduce((sum, r) => sum + r.amount, 0);

    // Monthly data for chart (last 12 months)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyData = months.map((name, index) => {
      const monthRevenues = revenuesData.filter(r => {
        const date = new Date(r.date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });
      return {
        name,
        value: monthRevenues.reduce((sum, r) => sum + r.amount, 0),
      };
    });

    // Category data
    const categoryMap = new Map<string, number>();
    revenuesData.forEach(r => {
      categoryMap.set(r.category, (categoryMap.get(r.category) || 0) + r.amount);
    });

    const colors = ['#c9a962', '#22c55e', '#3b82f6', '#a855f7', '#71717a'];
    const categoryData = Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);

    return {
      monthlyData,
      categoryData,
      stats: {
        thisMonth,
        thisMonthChange,
        yearToDate,
        yearToDateChange: 0, // Would need last year data
        activeClients,
        activeClientsChange: 0,
        recurring,
        recurringChange: 0,
      },
    };
  }, [revenuesData]);

  const filteredRevenues = revenuesData.filter((revenue) => {
    const matchesSearch =
      revenue.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      revenue.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || revenue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-semibold">Revenus</h1>
          <p className="text-text-secondary mt-1">Gérez et analysez vos sources de revenus</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4" />
            Nouveau revenu
          </Button>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ce mois', value: stats.thisMonth, change: stats.thisMonthChange, icon: Calendar },
          { label: 'Année en cours', value: stats.yearToDate, change: stats.yearToDateChange, icon: TrendingUp },
          { label: 'Clients actifs', value: stats.activeClients, change: stats.activeClientsChange, icon: Users, format: 'number' },
          { label: 'Revenus récurrents', value: stats.recurring, change: stats.recurringChange, icon: Repeat },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className={cn(
                    'text-sm font-medium flex items-center gap-1',
                    stat.change >= 0 ? 'text-success' : 'text-danger'
                  )}>
                    {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.format === 'number' ? `+${stat.change}` : formatPercent(stat.change)}
                  </span>
                </div>
                <p className="text-2xl font-semibold">
                  {stat.format === 'number' ? stat.value : formatCurrency(stat.value)}
                </p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Évolution mensuelle</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201, 169, 98, 0.1)' }} />
                  <Bar dataKey="value" fill="#c9a962" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Par catégorie</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-text-secondary">{cat.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold">Historique des revenus</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-100 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                !selectedCategory ? 'bg-accent text-surface' : 'bg-surface-100 text-text-secondary hover:text-text-primary'
              )}
            >
              Tous
            </button>
            {categoryData.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm transition-colors',
                  selectedCategory === cat.name ? 'bg-accent text-surface' : 'bg-surface-100 text-text-secondary hover:text-text-primary'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="table-header text-left pb-4">Source</th>
                  <th className="table-header text-left pb-4">Catégorie</th>
                  <th className="table-header text-left pb-4">Description</th>
                  <th className="table-header text-left pb-4">Date</th>
                  <th className="table-header text-right pb-4">Montant</th>
                  <th className="table-header text-right pb-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRevenues.map((revenue, index) => (
                  <motion.tr
                    key={revenue.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{revenue.source || 'N/A'}</span>
                        {revenue.is_recurring && (
                          <Repeat className="w-3.5 h-3.5 text-accent" />
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant="accent">{revenue.category}</Badge>
                    </td>
                    <td className="table-cell text-text-secondary">{revenue.description || '-'}</td>
                    <td className="table-cell text-text-secondary">{formatDate(new Date(revenue.date))}</td>
                    <td className="table-cell text-right font-semibold text-success">
                      +{formatCurrency(revenue.amount)}
                    </td>
                    <td className="table-cell text-right">
                      <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Transaction Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultType="revenue"
      />
    </div>
  );
}
