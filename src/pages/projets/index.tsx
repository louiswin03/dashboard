import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  FolderKanban,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '../../components/common';
import { cn, formatDate } from '../../utils';

const projects = [
  {
    id: '1',
    title: 'Refonte site e-commerce',
    description: 'Migration vers Next.js avec nouveau design',
    status: 'active',
    priority: 'high',
    progress: 65,
    dueDate: new Date('2024-12-30'),
    tasks: [
      { id: '1', title: 'Maquettes Figma', completed: true },
      { id: '2', title: 'Setup Next.js', completed: true },
      { id: '3', title: 'Composants UI', completed: true },
      { id: '4', title: 'Intégration API', completed: false },
      { id: '5', title: 'Tests & QA', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Application mobile fitness',
    description: 'App React Native pour suivi sportif',
    status: 'active',
    priority: 'medium',
    progress: 30,
    dueDate: new Date('2025-02-15'),
    tasks: [
      { id: '1', title: 'Analyse des besoins', completed: true },
      { id: '2', title: 'Design UI/UX', completed: true },
      { id: '3', title: 'Développement', completed: false },
      { id: '4', title: 'Backend API', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Dashboard analytics',
    description: 'Tableau de bord pour startup fintech',
    status: 'active',
    priority: 'high',
    progress: 85,
    dueDate: new Date('2024-12-20'),
    tasks: [
      { id: '1', title: 'Architecture', completed: true },
      { id: '2', title: 'Graphiques Recharts', completed: true },
      { id: '3', title: 'Filtres avancés', completed: true },
      { id: '4', title: 'Export PDF', completed: false },
    ],
  },
  {
    id: '4',
    title: 'Formation React avancé',
    description: 'Création contenu formation 10h',
    status: 'completed',
    priority: 'low',
    progress: 100,
    dueDate: new Date('2024-11-30'),
    tasks: [
      { id: '1', title: 'Plan de cours', completed: true },
      { id: '2', title: 'Slides', completed: true },
      { id: '3', title: 'Exercices', completed: true },
      { id: '4', title: 'Vidéos', completed: true },
    ],
  },
];

const priorityStyles = {
  high: { label: 'Haute', color: 'danger' as const },
  medium: { label: 'Moyenne', color: 'warning' as const },
  low: { label: 'Basse', color: 'default' as const },
};

const statusStyles = {
  active: { label: 'En cours', color: 'accent' as const },
  completed: { label: 'Terminé', color: 'success' as const },
  archived: { label: 'Archivé', color: 'default' as const },
};

export default function Projets() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === selectedProject);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-semibold">Projets</h1>
          <p className="text-text-secondary mt-1">Gérez vos projets et tâches</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                view === 'grid' ? 'bg-accent text-surface' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                view === 'list' ? 'bg-accent text-surface' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects list */}
        <div className={cn(selectedProject ? 'lg:col-span-2' : 'lg:col-span-3')}>
          <div className={cn(
            'grid gap-6',
            view === 'grid' 
              ? selectedProject ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          )}>
            {projects.map((project, index) => {
              const priority = priorityStyles[project.priority as keyof typeof priorityStyles];
              const status = statusStyles[project.status as keyof typeof statusStyles];
              const completedTasks = project.tasks.filter(t => t.completed).length;
              const isOverdue = new Date(project.dueDate) < new Date() && project.status !== 'completed';

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
                >
                  <Card className={cn(
                    'p-5 cursor-pointer transition-all',
                    selectedProject === project.id 
                      ? 'border-accent ring-2 ring-accent/20' 
                      : 'hover:border-accent/30'
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={status.color}>{status.label}</Badge>
                        <Badge variant={priority.color}>{priority.label}</Badge>
                      </div>
                      <button className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-text-muted mb-4">{project.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{completedTasks}/{project.tasks.length} tâches</span>
                        <span className="font-medium text-accent">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} size="sm" />
                    </div>

                    <div className={cn(
                      'flex items-center gap-2 mt-4 pt-4 border-t border-white/5 text-sm',
                      isOverdue ? 'text-danger' : 'text-text-muted'
                    )}>
                      {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      <span>{formatDate(project.dueDate)}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Project detail panel */}
        {selectedProject && activeProject && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-accent/10">
                  <FolderKanban className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">{activeProject.title}</h3>
                  <p className="text-sm text-text-muted">{activeProject.tasks.length} tâches</p>
                </div>
              </div>

              <div className="space-y-3">
                {activeProject.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-100/50 transition-colors cursor-pointer group"
                  >
                    <button className={cn(
                      'flex-shrink-0 transition-colors',
                      task.completed ? 'text-success' : 'text-text-muted hover:text-accent'
                    )}>
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span className={cn(
                      'flex-1',
                      task.completed && 'line-through text-text-muted'
                    )}>
                      {task.title}
                    </span>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 text-center text-sm text-accent hover:text-accent-light transition-colors rounded-xl hover:bg-accent/5 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter une tâche
              </button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
