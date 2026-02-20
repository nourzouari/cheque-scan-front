// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanLine, 
  CheckCircle, 
  History, 
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu // Ajout de Menu pour le bouton d'extension
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scan', icon: ScanLine, label: 'Scanner' },
    { path: '/validation', icon: CheckCircle, label: 'Validation' },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/stats', icon: BarChart3, label: 'Statistiques' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header avec logo et bouton */}
      <div className="sidebar-header">
        <div className="logo">
          <ScanLine size={collapsed ? 28 : 32} />
          {!collapsed && <span>Scan-Chèque</span>}
        </div>

        {/* Bouton d'extension/réduction - avec Menu ou Chevron selon l'état */}
       <button
  className="collapse-btn"
  onClick={() => setCollapsed(!collapsed)}
  title={collapsed ? "Développer" : "Réduire"}
>
  {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
</button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info" title={collapsed ? "Admin (Administrateur)" : undefined}>
          <div className="user-avatar">AD</div>
          {!collapsed && (
            <div className="user-details">
              <span className="user-name">Admin</span>
              <span className="user-role">Administrateur</span>
            </div>
          )}
        </div>
        <button 
          className="logout-btn"
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;