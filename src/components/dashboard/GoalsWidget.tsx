import { motion } from 'framer-motion';
import { Target, Plus, CheckCircle2 } from 'lucide-react';
import { Card, Progress, Badge } from '../common';
import { cn, formatCurrency, calculatePercentage } from '../../utils';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: 'business' | 'investment' | 'savings';
  deadline?: string;
}

interface GoalsWidgetProps {
  goals: Goal[];
}

const categoryStyles = {
  business: { label: 'Business', color: 'accent' as const },
  investment: { label: 'Investissement', color: 'success' as const },
  savings: { label: 'Épargne', color: 'warning' as const },
};

export default function GoalsWidget({ goals }: GoalsWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Objectifs</h3>
              <p className="text-sm text-text-muted">{goals.length} objectifs en cours</p>
            </div>
          </div>
          <button className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {goals.map((goal, index) => {
            const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
            const isCompleted = percentage >= 100;
            const style = categoryStyles[goal.category];

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                  isCompleted
                    ? 'border-success/30 bg-success/5'
                    : 'border-white/5 hover:border-accent/20 hover:bg-surface-100/50'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : null}
                    <h4 className={cn(
                      'font-medium',
                      isCompleted && 'text-success'
                    )}>
                      {goal.title}
                    </h4>
                  </div>
                  <Badge variant={style.color}>{style.label}</Badge>
                </div>

                <div className="space-y-2">
                  <Progress value={goal.currentAmount} max={goal.targetAmount} size="md" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      {formatCurrency(goal.currentAmount)}
                      <span className="text-text-muted"> / {formatCurrency(goal.targetAmount)}</span>
                    </span>
                    <span className={cn(
                      'font-medium',
                      isCompleted ? 'text-success' : 'text-accent'
                    )}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  {goal.deadline && !isCompleted && (
                    <p className="text-xs text-text-muted">
                      Échéance : {goal.deadline}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <button className="w-full mt-4 py-3 text-center text-sm text-accent hover:text-accent-light transition-colors rounded-xl hover:bg-accent/5">
          Gérer les objectifs →
        </button>
      </Card>
    </motion.div>
  );
}
