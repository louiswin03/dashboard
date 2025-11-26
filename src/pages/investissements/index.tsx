import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MoreHorizontal,
  Bitcoin,
  DollarSign,
  Building2,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/common';
import { cn, formatCurrency, formatPercent } from '../../utils';
import {
  AreaChart,
  Area,
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
const portfolioHistory = [
  { date: 'Jan', value: 68000 },
  { date: 'Fév', value: 71500 },
  { date: 'Mar', value: 69800 },
  { date: 'Avr', value: 74200 },
  { date: 'Mai', value: 76800 },
  { date: 'Jun', value: 73500 },
  { date: 'Jul', value: 78900 },
  { date: 'Aoû', value: 81200 },
  { date: 'Sep', value: 79500 },
  { date: 'Oct', value: 82800 },
  { date: 'Nov', value: 80100 },
  { date: 'Déc', value: 84320 },
];

const allocation = [
  { name: 'Actions', value: 42, color: '#3b82f6' },
  { name: 'Crypto', value: 28, color: '#f59e0b' },
  { name: 'Immobilier', value: 25, color: '#22c55e' },
  { name: 'Autres', value: 5, color: '#71717a' },
];

const investments = [
  { 
    id: '1', 
    name: 'Apple Inc.', 
    symbol: 'AAPL', 
    type: 'stock' as const,
    quantity: 50,
    buyPrice: 145.20,
    currentPrice: 189.50,
    value: 9475,
    change: 30.5,
    dailyChange: 1.2,
  },
  { 
    id: '2', 
    name: 'Microsoft', 
    symbol: 'MSFT', 
    type: 'stock' as const,
    quantity: 30,
    buyPrice: 285.00,
    currentPrice: 378.90,
    value: 11367,
    change: 32.9,
    dailyChange: -0.5,
  },
  { 
    id: '3', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    type: 'crypto' as const,
    quantity: 0.42,
    buyPrice: 35000,
    currentPrice: 43500,
    value: 18270,
    change: 24.3,
    dailyChange: 2.8,
  },
  { 
    id: '4', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    type: 'crypto' as const,
    quantity: 2.5,
    buyPrice: 1800,
    currentPrice: 2288,
    value: 5720,
    change: 27.1,
    dailyChange: -1.4,
  },
  { 
    id: '5', 
    name: 'Appartement Paris 11e', 
    symbol: 'IMMO', 
    type: 'real_estate' as const,
    quantity: 1,
    buyPrice: 320000,
    currentPrice: 350000,
    value: 35000,
    change: 9.4,
    dailyChange: 0,
  },
  { 
    id: '6', 
    name: 'Tesla Inc.', 
    symbol: 'TSLA', 
    type: 'stock' as const,
    quantity: 20,
    buyPrice: 180.00,
    currentPrice: 224.40,
    value: 4488,
    change: 24.7,
    dailyChange: 3.2,
  },
];

const typeIcons = {
  stock: DollarSign,
  crypto: Bitcoin,
  real_estate: Building2,
  other: Landmark,
};

const typeLabels = {
  stock: 'Action',
  crypto: 'Crypto',
  real_estate: 'Immobilier',
  other: 'Autre',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-50 border border-white/10 rounded-xl p-3 shadow-elevated">
        <p className="text-xs text-text-muted mb-1">{label}</p>
        <p className="text-sm font-medium">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Investissements() {
  const [showValues, setShowValues] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalChange = ((84320 - 68000) / 68000) * 100;
  const dailyChange = investments.reduce((sum, inv) => sum + (inv.value * inv.dailyChange / 100), 0);
  const dailyChangePercent = (dailyChange / totalValue) * 100;

  const filteredInvestments = selectedType 
    ? investments.filter(inv => inv.type === selectedType)
    : investments;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-semibold">Investissements</h1>
          <p className="text-text-secondary mt-1">Suivez la performance de votre portfolio</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Button variant="ghost" onClick={() => setShowValues(!showValues)}>
            {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </motion.div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-text-secondary mb-2">Valeur totale du portfolio</p>
                <div className="flex items-end gap-4">
                  <h2 className="text-4xl font-semibold tracking-tight">
                    {showValues ? formatCurrency(totalValue) : '••••••'}
                  </h2>
                  <div className={cn(
                    'flex items-center gap-1 text-lg font-medium pb-1',
                    totalChange >= 0 ? 'text-success' : 'text-danger'
                  )}>
                    {totalChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {formatPercent(totalChange)}
                  </div>
                </div>
                <p className="text-sm text-text-muted mt-2">
                  Aujourd'hui: {' '}
                  <span className={dailyChangePercent >= 0 ? 'text-success' : 'text-danger'}>
                    {dailyChangePercent >= 0 ? '+' : ''}{formatCurrency(dailyChange)} ({formatPercent(dailyChangePercent)})
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                {['1S', '1M', '3M', '1A', 'Max'].map((period) => (
                  <button
                    key={period}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm transition-colors',
                      period === '1A' ? 'bg-accent text-surface' : 'bg-surface-100 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioHistory}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c9a962" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#c9a962" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(v) => `${v/1000}k`} domain={['dataMin - 5000', 'dataMax + 5000']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#c9a962" strokeWidth={2} fill="url(#portfolioGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Allocation</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {allocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Investments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold">Vos actifs</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm transition-colors',
                  !selectedType ? 'bg-accent text-surface' : 'bg-surface-100 text-text-secondary hover:text-text-primary'
                )}
              >
                Tous
              </button>
              {Object.entries(typeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    selectedType === key ? 'bg-accent text-surface' : 'bg-surface-100 text-text-secondary hover:text-text-primary'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredInvestments.map((investment, index) => {
              const Icon = typeIcons[investment.type];
              const isPositive = investment.change >= 0;
              const isDailyPositive = investment.dailyChange >= 0;

              return (
                <motion.div
                  key={investment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-accent/20 hover:bg-surface-100/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'p-3 rounded-xl',
                      investment.type === 'stock' && 'bg-blue-500/10 text-blue-400',
                      investment.type === 'crypto' && 'bg-orange-500/10 text-orange-400',
                      investment.type === 'real_estate' && 'bg-emerald-500/10 text-emerald-400',
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium group-hover:text-accent transition-colors">{investment.name}</h4>
                        <Badge variant="default">{investment.symbol}</Badge>
                      </div>
                      <p className="text-sm text-text-muted">
                        {investment.quantity} × {showValues ? formatCurrency(investment.currentPrice) : '••••'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Daily change */}
                    <div className="text-right">
                      <p className="text-xs text-text-muted mb-1">Aujourd'hui</p>
                      <p className={cn(
                        'text-sm font-medium flex items-center gap-1 justify-end',
                        isDailyPositive ? 'text-success' : 'text-danger'
                      )}>
                        {isDailyPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {formatPercent(investment.dailyChange)}
                      </p>
                    </div>

                    {/* Total change */}
                    <div className="text-right">
                      <p className="text-xs text-text-muted mb-1">Total</p>
                      <p className={cn(
                        'text-sm font-medium flex items-center gap-1 justify-end',
                        isPositive ? 'text-success' : 'text-danger'
                      )}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {formatPercent(investment.change)}
                      </p>
                    </div>

                    {/* Value */}
                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-semibold">
                        {showValues ? formatCurrency(investment.value) : '••••'}
                      </p>
                    </div>

                    <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
