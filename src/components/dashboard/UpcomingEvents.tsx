import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { Card } from '../common';
import { cn, formatDate } from '../../utils';

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: 'meeting' | 'deadline' | 'reminder';
}

interface UpcomingEventsProps {
  events: Event[];
  currentDate: Date;
}

const typeStyles = {
  meeting: { label: 'Réunion', color: 'bg-blue-500' },
  deadline: { label: 'Deadline', color: 'bg-danger' },
  reminder: { label: 'Rappel', color: 'bg-warning' },
};

export default function UpcomingEvents({ events, currentDate }: UpcomingEventsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Agenda</h3>
              <p className="text-sm text-text-muted">
                {formatDate(currentDate, { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-text-muted">Aucun événement prévu</p>
            </div>
          ) : (
            events.map((event, index) => {
              const style = typeStyles[event.type];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-100/50 transition-colors cursor-pointer group"
                >
                  {/* Time indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn('w-2 h-2 rounded-full', style.color)} />
                    <div className="w-px h-full bg-white/10 mt-1" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium truncate group-hover:text-accent transition-colors">
                        {event.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <button className="w-full mt-4 py-3 text-center text-sm text-accent hover:text-accent-light transition-colors rounded-xl hover:bg-accent/5">
          Ouvrir le calendrier →
        </button>
      </Card>
    </motion.div>
  );
}
