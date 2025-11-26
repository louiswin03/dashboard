import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { useInsertTaxObligation } from '../../hooks/useSupabase';
import { Loader2, Calendar, DollarSign, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils';

interface TaxObligationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaxObligationForm({ isOpen, onClose }: TaxObligationFormProps) {
  const { mutate: insertTaxObligation, isPending } = useInsertTaxObligation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    estimated_amount: '',
    is_paid: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    insertTaxObligation(
      {
        title: formData.title,
        description: formData.description || undefined,
        due_date: formData.due_date,
        estimated_amount: formData.estimated_amount ? parseFloat(formData.estimated_amount) : undefined,
        is_paid: formData.is_paid,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({
            title: '',
            description: '',
            due_date: '',
            estimated_amount: '',
            is_paid: false,
          });
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle obligation fiscale"
      description="Suivez vos échéances fiscales"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <Input
          label="Titre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="TVA Q4 2025"
          icon={<AlertCircle className="w-5 h-5" />}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails de l'obligation fiscale..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Due Date and Estimated Amount */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date d'échéance"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            icon={<Calendar className="w-5 h-5" />}
            required
          />
          <Input
            label="Montant estimé"
            type="number"
            step="0.01"
            min="0"
            value={formData.estimated_amount}
            onChange={(e) => setFormData({ ...formData, estimated_amount: e.target.value })}
            placeholder="2500.00"
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>

        {/* Is Paid Checkbox */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_paid}
              onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-surface-100 text-accent focus:ring-accent focus:ring-offset-0"
            />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-text-muted" />
              <span className="text-sm">Déjà payé</span>
            </div>
          </label>
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
