import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { cn } from '../../utils';

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const currentMonth = 'Décembre 2024';

// Generate calendar days
const generateCalendarDays = () => {
  const days = [];
  // Previous month days
  for (let i = 0; i < 6; i++) {
    days.push({ day: 25 + i, isCurrentMonth: false, events: [] });
  }
  // Current month days
  for (let i = 1; i <= 31; i++) {
    const events = [];
    if (i === 5) events.push({ title: 'Call client', color: 'bg-blue-500' });
    if (i === 12) events.push({ title: 'Deadline projet', color: 'bg-danger' });
    if (i === 15) events.push({ title: 'Réunion équipe', color: 'bg-accent' }, { title: 'Formation', color: 'bg-success' });
    if (i === 20) events.push({ title: 'Livraison', color: 'bg-warning' });
    if (i === 25) events.push({ title: 'Noël', color: 'bg-success' });
    days.push({ day: i, isCurrentMonth: true, isToday: i === 18, events });
  }
  return days;
};

const calendarDays = generateCalendarDays();

const upcomingEvents = [
  { id: 1, title: 'Call client ABC', time: '10:00 - 11:00', date: 'Aujourd\'hui', type: 'meeting' },
  { id: 2, title: 'Livraison maquettes', time: '14:00', date: 'Aujourd\'hui', type: 'deadline' },
  { id: 3, title: 'Réunion équipe', time: '09:00 - 10:00', date: 'Demain', type: 'meeting' },
  { id: 4, title: 'Déclaration TVA', time: 'Toute la journée', date: '20 Dec', type: 'reminder' },
];

export default function Agenda() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-semibold">Agenda</h1>
          <p className="text-text-secondary mt-1">Gérez vos rendez-vous et échéances</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Nouvel événement
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{currentMonth}</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors">
                  Aujourd'hui
                </button>
                <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-text-muted py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={cn(
                    'min-h-[100px] p-2 rounded-lg border transition-all cursor-pointer',
                    day.isCurrentMonth 
                      ? 'border-white/5 hover:border-accent/30 hover:bg-surface-100/50' 
                      : 'border-transparent opacity-40',
                    day.isToday && 'border-accent bg-accent/5'
                  )}
                >
                  <span className={cn(
                    'text-sm font-medium',
                    day.isToday && 'text-accent'
                  )}>
                    {day.day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {day.events.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={cn('text-xs px-1.5 py-0.5 rounded truncate', event.color, 'bg-opacity-20')}
                      >
                        {event.title}
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-xs text-text-muted">
                        +{day.events.length - 2} autres
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-accent/10">
                <CalendarIcon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">À venir</h3>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-3 rounded-xl border border-white/5 hover:border-accent/20 hover:bg-surface-100/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-text-muted mt-1">{event.time}</p>
                    </div>
                    <span className="text-xs text-text-muted">{event.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
