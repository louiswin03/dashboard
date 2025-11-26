import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { useInsertEvent } from '../../hooks/useSupabase';
import { Loader2, Calendar, Clock, MapPin, FileText, Tag } from 'lucide-react';
import { cn } from '../../utils';
import type { EventType } from '../../types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const eventTypes: { value: EventType; label: string; icon: string }[] = [
  { value: 'meeting', label: 'Réunion', icon: '👥' },
  { value: 'deadline', label: 'Échéance', icon: '⏰' },
  { value: 'conference', label: 'Conférence', icon: '🎤' },
  { value: 'other', label: 'Autre', icon: '📌' },
];

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  const { mutate: insertEvent, isPending } = useInsertEvent();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting' as EventType,
    location: '',
    start_time: '',
    end_time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    insertEvent(
      {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        location: formData.location || undefined,
        start_time: formData.start_time,
        end_time: formData.end_time || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({
            title: '',
            description: '',
            type: 'meeting',
            location: '',
            start_time: '',
            end_time: '',
          });
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvel événement"
      description="Ajoutez un événement à votre agenda"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Type d'événement</label>
          <div className="grid grid-cols-2 gap-3">
            {eventTypes.map((type) => (
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

        {/* Title */}
        <Input
          label="Titre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Rendez-vous client"
          icon={<Tag className="w-5 h-5" />}
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
              placeholder="Détails de l'événement..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Location */}
        <Input
          label="Lieu (optionnel)"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Visioconférence / Adresse"
          icon={<MapPin className="w-5 h-5" />}
        />

        {/* Start Time */}
        <Input
          label="Début"
          type="datetime-local"
          value={formData.start_time}
          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          icon={<Clock className="w-5 h-5" />}
          required
        />

        {/* End Time */}
        <Input
          label="Fin (optionnel)"
          type="datetime-local"
          value={formData.end_time}
          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          icon={<Clock className="w-5 h-5" />}
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
