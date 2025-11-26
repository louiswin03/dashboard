import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { useInsertTransaction } from '../../hooks/useSupabase';
import { Loader2, Euro, Calendar, FileText, Tag, Building2, Repeat, Receipt } from 'lucide-react';
import { cn } from '../../utils';
import type { TransactionType } from '../../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

const categories = {
  revenue: ['Freelance', 'Consulting', 'Produits', 'Formation', 'Services', 'Autre'],
  expense: ['Outils', 'Marketing', 'Bureautique', 'Formation', 'Transport', 'Restaurant', 'Autre'],
};

export default function TransactionForm({ isOpen, onClose, defaultType = 'revenue' }: TransactionFormProps) {
  const { mutate: insertTransaction, isPending } = useInsertTransaction();

  const [formData, setFormData] = useState({
    type: defaultType,
    amount: '',
    category: '',
    source: '',
    merchant: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    is_recurring: false,
    is_deductible: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (formData.type === 'revenue' && !formData.source) {
      newErrors.source = 'La source est requise pour un revenu';
    }

    if (formData.type === 'expense' && !formData.merchant) {
      newErrors.merchant = 'Le marchand est requis pour une dépense';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    insertTransaction(
      {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        source: formData.type === 'revenue' ? formData.source : undefined,
        merchant: formData.type === 'expense' ? formData.merchant : undefined,
        description: formData.description || undefined,
        date: formData.date,
        is_recurring: formData.is_recurring,
        is_deductible: formData.is_deductible,
      },
      {
        onSuccess: () => {
          onClose();
          // Reset form
          setFormData({
            type: defaultType,
            amount: '',
            category: '',
            source: '',
            merchant: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            is_recurring: false,
            is_deductible: false,
          });
          setErrors({});
        },
      }
    );
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle transaction"
      description="Ajoutez un revenu ou une dépense"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange('type', 'revenue')}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-left',
                formData.type === 'revenue'
                  ? 'border-success bg-success/10'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              <div className="text-2xl mb-1">💰</div>
              <div className="font-medium">Revenu</div>
              <div className="text-xs text-text-muted">Entrée d'argent</div>
            </button>
            <button
              type="button"
              onClick={() => handleChange('type', 'expense')}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-left',
                formData.type === 'expense'
                  ? 'border-danger bg-danger/10'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              <div className="text-2xl mb-1">💸</div>
              <div className="font-medium">Dépense</div>
              <div className="text-xs text-text-muted">Sortie d'argent</div>
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Montant"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          placeholder="1500.00"
          icon={<Euro className="w-5 h-5" />}
          error={errors.amount}
          required
        />

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Catégorie</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted z-10" />
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl',
                'transition-all duration-200 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 appearance-none',
                errors.category && 'border-danger'
              )}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories[formData.type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {errors.category && <p className="text-sm text-danger mt-1">{errors.category}</p>}
        </div>

        {/* Source (for revenue) or Merchant (for expense) */}
        {formData.type === 'revenue' ? (
          <Input
            label="Source"
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            placeholder="Client ABC"
            icon={<Building2 className="w-5 h-5" />}
            error={errors.source}
            required
          />
        ) : (
          <Input
            label="Marchand"
            value={formData.merchant}
            onChange={(e) => handleChange('merchant', e.target.value)}
            placeholder="Adobe"
            icon={<Receipt className="w-5 h-5" />}
            error={errors.merchant}
            required
          />
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Détails supplémentaires..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          icon={<Calendar className="w-5 h-5" />}
          required
        />

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_recurring}
              onChange={(e) => handleChange('is_recurring', e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-surface-100 text-accent focus:ring-accent focus:ring-offset-0"
            />
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-text-muted" />
              <span className="text-sm">Transaction récurrente</span>
            </div>
          </label>

          {formData.type === 'expense' && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_deductible}
                onChange={(e) => handleChange('is_deductible', e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-surface-100 text-accent focus:ring-accent focus:ring-offset-0"
              />
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-text-muted" />
                <span className="text-sm">Déductible fiscalement</span>
              </div>
            </label>
          )}
        </div>

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
