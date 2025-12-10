import React from 'react';
import { LayoutDashboard, ShoppingCart, ClipboardList, Settings, FileText } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { id: 'pos', icon: ShoppingCart, label: 'Frente de Caixa' },
    { id: 'control', icon: ClipboardList, label: 'Controle' },
    { id: 'reports', icon: FileText, label: 'Relatórios' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="flex flex-col h-full w-full text-white">
      <div className="p-6 border-b border-slate-800 hidden md:block">
        <h1 className="text-2xl font-bold tracking-tight text-plena-500">Plena</h1>
        <p className="text-xs text-slate-400">Gestão de Bebidas</p>
      </div>

      {/* Mobile Title inside sidebar (only visible when menu is open) */}
      <div className="p-6 border-b border-slate-800 md:hidden mt-12">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Menu Principal</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all active:scale-95 duration-200 ${
                isActive 
                  ? 'bg-plena-600 text-white shadow-lg shadow-plena-900/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800 mt-auto bg-slate-900">
        <div className="text-xs text-slate-500 text-center leading-relaxed space-y-1">
          <p>&copy; 2025 Direitos Reservados</p>
          <p>
            Desenvolvido por{' '}
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="hover:text-plena-400 transition-colors duration-200 cursor-default"
            >
              Plena Aplicativos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;