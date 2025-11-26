import { useState, useMemo } from 'react';
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
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/common';
import { cn, formatCurrency, formatDate, formatPercent } from '../../utils';
import { useTaxObligations, useDeleteTaxObligation, useDashboardStats } from '../../hooks/useSupabase';
import TaxObligationForm from '../../components/forms/TaxObligationForm';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch data
  const { data: taxObligations = [], isLoading } = useTaxObligations();
  const { mutate: deleteTaxObligation } = useDeleteTaxObligation();
  const { data: stats } = useDashboardStats();

  // Mock tax chart data (in real app, would calculate from transactions)
  const taxData = [
    {
      name: 'T1',
      revenue: (stats?.monthlyRevenue || 0) * 3 * 0.85,
      tva: (stats?.monthlyRevenue || 0) * 3 * 0.85 * 0.2,
      ir: (stats?.monthlyRevenue || 0) * 3 * 0.85 * 0.15,
    },
    {
      name: 'T2',
      revenue: (stats?.monthlyRevenue || 0) * 3 * 0.92,
      tva: (stats?.monthlyRevenue || 0) * 3 * 0.92 * 0.2,
      ir: (stats?.monthlyRevenue || 0) * 3 * 0.92 * 0.15,
    },
    {
      name: 'T3',
      revenue: (stats?.monthlyRevenue || 0) * 3 * 0.98,
      tva: (stats?.monthlyRevenue || 0) * 3 * 0.98 * 0.2,
      ir: (stats?.monthlyRevenue || 0) * 3 * 0.98 * 0.15,
    },
    {
      name: 'T4',
      revenue: (stats?.monthlyRevenue || 0) * 3,
      tva: (stats?.monthlyRevenue || 0) * 3 * 0.2,
      ir: (stats?.monthlyRevenue || 0) * 3 * 0.15,
    },
  ];

  // Calculate stats
  const yearlyRevenue = taxData.reduce((sum, q) => sum + q.revenue, 0);
  const yearlyTVA = taxData.reduce((sum, q) => sum + q.tva, 0);
  const estimatedTax = taxData.reduce((sum, q) => sum + q.ir, 0);

  // Separate upcoming and completed obligations
  const { upcoming, completed } = useMemo(() => {
    const now = new Date();
    const upcoming = taxObligations
      .filter(o => !o.is_paid && new Date(o.due_date) >= now)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    const completed = taxObligations
      .filter(o => o.is_paid)
      .sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())
      .slice(0, 5);

    return { upcoming, completed };
  }, [taxObligations]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette obligation fiscale ?')) {
      deleteTaxObligation(id);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const displayStats = [
    { label: 'CA annuel estimé', value: yearlyRevenue, icon: Euro, change: 18.3 },
    { label: 'TVA collectée', value: yearlyTVA, icon: Receipt, change: null },
    { label: 'Charges déductibles', value: stats?.totalDeductibleExpenses || 0, icon: TrendingDown, change: null },
    { label: 'Impôt estimé', value: estimatedTax, icon: Building2, change: -5.2 },
  ];

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
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4" />
            Ajouter obligation
          </Button>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
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
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">Chargement...</p>
                </div>
              ) : upcoming.length === 0 && completed.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">Aucune obligation</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Ajouter une obligation
                  </Button>
                </div>
              ) : (
                <>
                  {upcoming.map((item, index) => {
                    const overdue = isOverdue(item.due_date);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className={cn(
                          'p-3 rounded-xl border transition-all group',
                          overdue
                            ? 'border-danger/20 bg-danger/5'
                            : 'border-white/5 hover:border-accent/20 hover:bg-surface-100/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {overdue ? (
                            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                          ) : (
                            <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className={cn('font-medium', overdue && 'text-danger')}>
                              {item.title}
                            </p>
                            <p className="text-sm text-text-muted">
                              {formatDate(new Date(item.due_date))}
                            </p>
                            {item.estimated_amount && (
                              <p className="text-sm font-medium mt-1">
                                {formatCurrency(item.estimated_amount)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {completed.length > 0 && (
                    <>
                      <div className="pt-3 border-t border-white/5">
                        <p className="text-xs text-text-muted font-medium uppercase mb-2">
                          Complétées
                        </p>
                      </div>
                      {completed.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="p-3 rounded-xl border border-success/20 bg-success/5 group"
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-success">{item.title}</p>
                              <p className="text-sm text-text-muted">
                                {formatDate(new Date(item.due_date))}
                              </p>
                              {item.estimated_amount && (
                                <p className="text-sm font-medium mt-1">
                                  {formatCurrency(item.estimated_amount)}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-1 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tax Obligation Form Modal */}
      <TaxObligationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
