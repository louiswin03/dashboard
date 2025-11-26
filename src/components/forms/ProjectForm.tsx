import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { useInsertProject } from '../../hooks/useSupabase';
import { Loader2, Target, Calendar, DollarSign, FileText, Briefcase } from 'lucide-react';
import { cn } from '../../utils';
import type { ProjectStatus } from '../../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const projectStatuses: { value: ProjectStatus; label: string; icon: string }[] = [
  { value: 'planning', label: 'Planification', icon: '📋' },
  { value: 'active', label: 'En cours', icon: '🚀' },
  { value: 'on_hold', label: 'En pause', icon: '⏸️' },
  { value: 'completed', label: 'Terminé', icon: '✅' },
];

export default function ProjectForm({ isOpen, onClose }: ProjectFormProps) {
  const { mutate: insertProject, isPending } = useInsertProject();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as ProjectStatus,
    budget: '',
    revenue_goal: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    insertProject(
      {
        name: formData.name,
        description: formData.description || undefined,
        status: formData.status,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        revenue_goal: formData.revenue_goal ? parseFloat(formData.revenue_goal) : undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({
            name: '',
            description: '',
            status: 'planning',
            budget: '',
            revenue_goal: '',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
          });
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouveau projet"
      description="Créez un nouveau projet entrepreneurial"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Statut</label>
          <div className="grid grid-cols-2 gap-3">
            {projectStatuses.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => setFormData({ ...formData, status: status.value })}
                className={cn(
                  'p-3 rounded-xl border-2 transition-all text-left',
                  formData.status === status.value
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <div className="text-xl mb-1">{status.icon}</div>
                <div className="text-sm font-medium">{status.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <Input
          label="Nom du projet"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Lancement de ma nouvelle offre"
          icon={<Briefcase className="w-5 h-5" />}
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
              placeholder="Détails du projet..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Budget and Revenue Goal */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Budget (optionnel)"
            type="number"
            step="0.01"
            min="0"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="5000.00"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <Input
            label="Objectif de revenu"
            type="number"
            step="0.01"
            min="0"
            value={formData.revenue_goal}
            onChange={(e) => setFormData({ ...formData, revenue_goal: e.target.value })}
            placeholder="15000.00"
            icon={<Target className="w-5 h-5" />}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date de début"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            icon={<Calendar className="w-5 h-5" />}
          />
          <Input
            label="Date de fin (optionnel)"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            icon={<Calendar className="w-5 h-5" />}
          />
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
