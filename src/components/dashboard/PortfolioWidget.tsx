import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Building2, MoreHorizontal } from 'lucide-react';
import { Card } from '../common';
import { cn, formatCurrency, formatPercent } from '../../utils';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: 'stock' | 'crypto' | 'real_estate';
  value: number;
  change: number;
  allocation: number;
}

interface PortfolioWidgetProps {
  assets: Asset[];
  totalValue: number;
  totalChange: number;
}

const typeIcons = {
  stock: DollarSign,
  crypto: Bitcoin,
  real_estate: Building2,
};

const typeColors = {
  stock: 'text-blue-400 bg-blue-400/10',
  crypto: 'text-orange-400 bg-orange-400/10',
  real_estate: 'text-emerald-400 bg-emerald-400/10',
};

export default function PortfolioWidget({ assets, totalValue, totalChange }: PortfolioWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Portfolio</h3>
            <p className="text-sm text-text-muted">Vos investissements</p>
          </div>
          <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Total value */}
        <div className="mb-6 pb-6 border-b border-white/5">
          <p className="text-sm text-text-secondary mb-1">Valeur totale</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-semibold tracking-tight">
              {formatCurrency(totalValue)}
            </span>
            <span className={cn(
              'flex items-center gap-1 text-sm font-medium pb-1',
              totalChange >= 0 ? 'text-success' : 'text-danger'
            )}>
              {totalChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {formatPercent(totalChange)}
            </span>
          </div>
        </div>

        {/* Assets list */}
        <div className="space-y-3">
          {assets.map((asset, index) => {
            const Icon = typeIcons[asset.type];
            const colorClass = typeColors[asset.type];

            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-100/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-text-muted">{asset.symbol}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">{formatCurrency(asset.value)}</p>
                  <p className={cn(
                    'text-sm',
                    asset.change >= 0 ? 'text-success' : 'text-danger'
                  )}>
                    {formatPercent(asset.change)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all button */}
        <button className="w-full mt-4 py-3 text-center text-sm text-accent hover:text-accent-light transition-colors rounded-xl hover:bg-accent/5">
          Voir tous les investissements →
        </button>
      </Card>
    </motion.div>
  );
}
