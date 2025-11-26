import { useState, useMemo } from 'react';
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
  Trash2,
  DollarSign,
  Target,
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '../../components/common';
import { cn, formatDate, formatCurrency } from '../../utils';
import { useProjects, useDeleteProject } from '../../hooks/useSupabase';
import ProjectForm from '../../components/forms/ProjectForm';

const statusStyles = {
  planning: { label: 'Planification', color: 'default' as const },
  active: { label: 'En cours', color: 'accent' as const },
  on_hold: { label: 'En pause', color: 'warning' as const },
  completed: { label: 'Terminé', color: 'success' as const },
  cancelled: { label: 'Annulé', color: 'danger' as const },
};

export default function Projets() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: projectsData = [], isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const activeProject = projectsData.find(p => p.id === selectedProject);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(id);
      if (selectedProject === id) {
        setSelectedProject(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-semibold">Projets</h1>
          <p className="text-text-secondary mt-1">Gérez vos projets entrepreneuriaux</p>
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
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects list */}
        <div className={cn(selectedProject ? 'lg:col-span-2' : 'lg:col-span-3')}>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-text-muted">Chargement...</p>
            </div>
          ) : projectsData.length === 0 ? (
            <Card className="p-8 text-center">
              <FolderKanban className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">Aucun projet trouvé</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => setIsFormOpen(true)}
              >
                Créer votre premier projet
              </Button>
            </Card>
          ) : (
            <div className={cn(
              'grid gap-6',
              view === 'grid'
                ? selectedProject ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            )}>
              {projectsData.map((project, index) => {
                const status = statusStyles[project.status];
                const isOverdue = project.end_date && new Date(project.end_date) < new Date() && project.status !== 'completed';

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
                  >
                    <Card className={cn(
                      'p-5 cursor-pointer transition-all group',
                      selectedProject === project.id
                        ? 'border-accent ring-2 ring-accent/20'
                        : 'hover:border-accent/30'
                    )}>
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant={status.color}>{status.label}</Badge>
                        <button
                          onClick={(e) => handleDelete(project.id, e)}
                          className="p-1 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-semibold mb-1">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-text-muted mb-4 line-clamp-2">{project.description}</p>
                      )}

                      <div className="space-y-3">
                        {project.budget && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-text-muted" />
                            <span className="text-text-secondary">
                              Budget: {formatCurrency(project.budget)}
                            </span>
                          </div>
                        )}
                        {project.revenue_goal && (
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="w-4 h-4 text-text-muted" />
                            <span className="text-text-secondary">
                              Objectif: {formatCurrency(project.revenue_goal)}
                            </span>
                          </div>
                        )}
                      </div>

                      {project.end_date && (
                        <div className={cn(
                          'flex items-center gap-2 mt-4 pt-4 border-t border-white/5 text-sm',
                          isOverdue ? 'text-danger' : 'text-text-muted'
                        )}>
                          {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                          <span>Échéance: {formatDate(new Date(project.end_date))}</span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
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
                  <h3 className="font-semibold">{activeProject.name}</h3>
                  <Badge variant={statusStyles[activeProject.status].color} className="mt-1">
                    {statusStyles[activeProject.status].label}
                  </Badge>
                </div>
              </div>

              {activeProject.description && (
                <div className="mb-4">
                  <p className="text-sm text-text-secondary">{activeProject.description}</p>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-white/5">
                {activeProject.start_date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Début</span>
                    <span className="text-text-secondary">{formatDate(new Date(activeProject.start_date))}</span>
                  </div>
                )}
                {activeProject.end_date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Fin</span>
                    <span className="text-text-secondary">{formatDate(new Date(activeProject.end_date))}</span>
                  </div>
                )}
                {activeProject.budget && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Budget</span>
                    <span className="font-medium text-accent">{formatCurrency(activeProject.budget)}</span>
                  </div>
                )}
                {activeProject.revenue_goal && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Objectif revenu</span>
                    <span className="font-medium text-success">{formatCurrency(activeProject.revenue_goal)}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
