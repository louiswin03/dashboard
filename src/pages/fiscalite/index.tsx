import { motion } from 'framer-motion';
import {
  Receipt,
  Calculator,
  FileText,
  CheckCircle,
  Clock,
  TrendingDown,
  Euro,
  Building2,
  Download,
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '../../components/common';
import { cn, formatCurrency, formatPercent } from '../../utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const taxData = [
  { name: 'T1', revenue: 28500, tva: 5700, ir: 4275 },
  { name: 'T2', revenue: 32100, tva: 6420, ir: 4815 },
  { name: 'T3', revenue: 35400, tva: 7080, ir: 5310 },
  { name: 'T4', revenue: 38850, tva: 7770, ir: 5828 },
];

const obligations = [
  { id: '1', title: 'Déclaration TVA T4', dueDate: '15 Jan 2025', status: 'upcoming', amount: 7770 },
  { id: '2', title: 'Acompte IS', dueDate: '15 Mar 2025', status: 'upcoming', amount: 3200 },
  { id: '3', title: 'Déclaration revenus 2024', dueDate: '1 Juin 2025', status: 'upcoming', amount: null },
  { id: '4', title: 'Déclaration TVA T3', dueDate: '15 Oct 2024', status: 'completed', amount: 7080 },
  { id: '5', title: 'CFE', dueDate: '15 Déc 2024', status: 'completed', amount: 890 },
];

const deductions = [
  { id: '1', category: 'Matériel informatique', amount: 2450, status: 'validated' },
  { id: '2', category: 'Abonnements logiciels', amount: 1890, status: 'validated' },
  { id: '3', category: 'Frais de déplacement', amount: 980, status: 'pending' },
  { id: '4', category: 'Formation professionnelle', amount: 1500, status: 'validated' },
  { id: '5', category: 'Téléphone & Internet', amount: 720, status: 'validated' },
];

const stats = [
  { label: 'CA annuel', value: 134850, icon: Euro, change: 18.3 },
  { label: 'TVA collectée', value: 26970, icon: Receipt, change: null },
  { label: 'Charges déductibles', value: 7540, icon: TrendingDown, change: null },
  { label: 'Impôt estimé', value: 20228, icon: Building2, change: -5.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-50 border border-white/10 rounded-xl p-3 shadow-elevated">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">CA:</span>
            <span className="font-medium">{formatCurrency(payload[0]?.payload.revenue)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">TVA:</span>
            <span className="font-medium">{formatCurrency(payload[1]?.value)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">IR:</span>
            <span className="font-medium">{formatCurrency(payload[2]?.value)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function Fiscalite() {
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const validatedDeductions = deductions.filter(d => d.status === 'validated').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-semibold">Fiscalité</h1>
          <p className="text-text-secondary mt-1">Suivez vos obligations et optimisez vos impôts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export fiscal
          </Button>
          <Button variant="primary">
            <Calculator className="w-4 h-4" />
            Simuler
          </Button>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
                  {stat.change !== null && (
                    <span className={cn(
                      'text-sm font-medium',
                      stat.change >= 0 ? 'text-success' : 'text-danger'
                    )}>
                      {formatPercent(stat.change)}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold">{formatCurrency(stat.value)}</p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Revenus & Charges fiscales par trimestre</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taxData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#c9a962" radius={[4, 4, 0, 0]} name="CA" />
                  <Bar dataKey="tva" fill="#3b82f6" radius={[4, 4, 0, 0]} name="TVA" />
                  <Bar dataKey="ir" fill="#ef4444" radius={[4, 4, 0, 0]} name="IR" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm text-text-secondary">Chiffre d'affaires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-text-secondary">TVA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <span className="text-sm text-text-secondary">Impôt sur le revenu</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Obligations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-accent/10">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Obligations</h3>
            </div>

            <div className="space-y-3">
              {obligations.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={cn(
                    'p-3 rounded-xl border transition-all cursor-pointer',
                    item.status === 'completed'
                      ? 'border-success/20 bg-success/5'
                      : 'border-white/5 hover:border-accent/20 hover:bg-surface-100/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={cn(
                        'font-medium',
                        item.status === 'completed' && 'text-success'
                      )}>
                        {item.title}
                      </p>
                      <p className="text-sm text-text-muted">{item.dueDate}</p>
                      {item.amount && (
                        <p className="text-sm font-medium mt-1">{formatCurrency(item.amount)}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Deductions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success/10">
                <TrendingDown className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Charges déductibles</h3>
                <p className="text-sm text-text-muted">
                  {formatCurrency(validatedDeductions)} validés sur {formatCurrency(totalDeductions)}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Ajouter une charge
            </Button>
          </div>

          <div className="mb-6">
            <Progress value={validatedDeductions} max={totalDeductions} size="md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deductions.map((deduction, index) => (
              <motion.div
                key={deduction.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="p-4 rounded-xl border border-white/5 hover:border-accent/20 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium">{deduction.category}</p>
                  <Badge variant={deduction.status === 'validated' ? 'success' : 'warning'}>
                    {deduction.status === 'validated' ? 'Validé' : 'En attente'}
                  </Badge>
                </div>
                <p className="text-xl font-semibold text-success">-{formatCurrency(deduction.amount)}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
