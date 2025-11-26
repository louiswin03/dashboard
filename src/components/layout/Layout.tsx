import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../utils';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface relative">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-accent/3 via-transparent to-transparent opacity-50" />
      </div>

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Header */}
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* Main content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 80 : 280,
          paddingTop: 80,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn('min-h-screen relative z-10')}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
