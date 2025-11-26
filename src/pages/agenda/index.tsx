import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Trash2,
  Clock,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/common';
import { cn, formatDate } from '../../utils';
import { useEvents, useDeleteEvent } from '../../hooks/useSupabase';
import EventForm from '../../components/forms/EventForm';

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const eventTypeColors = {
  meeting: 'bg-blue-500',
  deadline: 'bg-danger',
  conference: 'bg-accent',
  other: 'bg-warning',
};

const eventTypeLabels = {
  meeting: 'Réunion',
  deadline: 'Échéance',
  conference: 'Conférence',
  other: 'Autre',
};

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get start and end of current month for fetching events
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const { data: eventsData = [], isLoading } = useEvents(startOfMonth, endOfMonth);
  const { mutate: deleteEvent } = useDeleteEvent();

  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get first day of week (0 = Sunday, 1 = Monday)
    let firstDayOfWeek = firstDay.getDay();
    // Convert to Monday = 0
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
        events: []
      });
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateKey = date.toISOString().split('T')[0];

      // Filter events for this day
      const dayEvents = eventsData.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.toISOString().split('T')[0] === dateKey;
      });

      const isToday = date.getTime() === today.getTime();

      days.push({
        day: i,
        isCurrentMonth: true,
        isToday,
        date,
        events: dayEvents
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
        events: []
      });
    }

    return days;
  }, [currentDate, eventsData]);

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return eventsData
      .filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate >= now && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 10);
  }, [eventsData]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEvent(id);
    }
  };

  const formatEventTime = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const startStr = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (endTime) {
      const end = new Date(endTime);
      const endStr = end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      return `${startStr} - ${endStr}`;
    }

    return startStr;
  };

  const getRelativeDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);

    const diff = eventDate.getTime() - today.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Demain';
    if (days > 1 && days < 7) return `Dans ${days} jours`;

    return formatDate(date);
  };

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
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
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
              <h2 className="text-xl font-semibold capitalize">{currentMonth}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors"
                >
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
                  onClick={() => setSelectedDate(day.date)}
                >
                  <span className={cn(
                    'text-sm font-medium',
                    day.isToday && 'text-accent'
                  )}>
                    {day.day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {day.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded truncate',
                          eventTypeColors[event.type],
                          'bg-opacity-20 text-white'
                        )}
                        title={event.title}
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

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">Chargement...</p>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">Aucun événement à venir</p>
                </div>
              ) : (
                upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="p-3 rounded-xl border border-white/5 hover:border-accent/20 hover:bg-surface-100/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant="default" className="text-xs">
                            {eventTypeLabels[event.type]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Clock className="w-3 h-3" />
                          {formatEventTime(event.start_time, event.end_time)}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleDelete(event.id, e)}
                        className="p-1 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-text-muted">
                      {getRelativeDate(new Date(event.start_time))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Event Form Modal */}
      <EventForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
