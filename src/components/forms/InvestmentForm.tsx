import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { useInsertInvestment } from '../../hooks/useSupabase';
import { Loader2, DollarSign, Hash, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '../../utils';
import type { InvestmentType } from '../../types';

interface InvestmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const investmentTypes: { value: InvestmentType; label: string; icon: string }[] = [
  { value: 'stock', label: 'Action', icon: '📈' },
  { value: 'crypto', label: 'Crypto', icon: '₿' },
  { value: 'real_estate', label: 'Immobilier', icon: '🏠' },
  { value: 'other', label: 'Autre', icon: '💼' },
];

export default function InvestmentForm({ isOpen, onClose }: InvestmentFormProps) {
  const { mutate: insertInvestment, isPending } = useInsertInvestment();

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    type: 'stock' as InvestmentType,
    quantity: '',
    buy_price: '',
    current_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    insertInvestment(
      {
        name: formData.name,
        symbol: formData.symbol || undefined,
        type: formData.type,
        quantity: parseFloat(formData.quantity),
        buy_price: parseFloat(formData.buy_price),
        current_price: formData.current_price ? parseFloat(formData.current_price) : undefined,
        purchase_date: formData.purchase_date || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({
            name: '',
            symbol: '',
            type: 'stock',
            quantity: '',
            buy_price: '',
            current_price: '',
            purchase_date: new Date().toISOString().split('T')[0],
          });
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvel investissement"
      description="Ajoutez un actif à votre portfolio"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Type d'actif</label>
          <div className="grid grid-cols-2 gap-3">
            {investmentTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.value })}
                className={cn(
                  'p-3 rounded-xl border-2 transition-all text-left',
                  formData.type === type.value
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <div className="text-xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <Input
          label="Nom de l'actif"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Apple Inc."
          icon={<TrendingUp className="w-5 h-5" />}
          required
        />

        {/* Symbol */}
        <Input
          label="Symbole (optionnel)"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          placeholder="AAPL"
        />

        {/* Quantity and Buy Price */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantité"
            type="number"
            step="0.00000001"
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="10"
            icon={<Hash className="w-5 h-5" />}
            required
          />
          <Input
            label="Prix d'achat"
            type="number"
            step="0.01"
            min="0"
            value={formData.buy_price}
            onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })}
            placeholder="150.00"
            icon={<DollarSign className="w-5 h-5" />}
            required
          />
        </div>

        {/* Current Price */}
        <Input
          label="Prix actuel (optionnel)"
          type="number"
          step="0.01"
          min="0"
          value={formData.current_price}
          onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
          placeholder="175.00"
          icon={<DollarSign className="w-5 h-5" />}
        />

        {/* Purchase Date */}
        <Input
          label="Date d'achat"
          type="date"
          value={formData.purchase_date}
          onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
          icon={<Calendar className="w-5 h-5" />}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
