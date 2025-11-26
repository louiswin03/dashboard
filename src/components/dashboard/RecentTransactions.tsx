import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { Card, Badge } from '../common';
import { cn, formatCurrency, formatRelativeTime } from '../../utils';

interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Transactions récentes</h3>
            <p className="text-sm text-text-muted">Dernières activités</p>
          </div>
          <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {transactions.map((transaction, index) => {
            const isRevenue = transaction.type === 'revenue';

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-100/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isRevenue ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  )}>
                    {isRevenue ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={isRevenue ? 'success' : 'danger'}>
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-text-muted">
                        {formatRelativeTime(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={cn(
                  'font-semibold',
                  isRevenue ? 'text-success' : 'text-danger'
                )}>
                  {isRevenue ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </motion.div>
            );
          })}
        </div>

        <button className="w-full mt-4 py-3 text-center text-sm text-accent hover:text-accent-light transition-colors rounded-xl hover:bg-accent/5">
          Voir toutes les transactions →
        </button>
      </Card>
    </motion.div>
  );
}
