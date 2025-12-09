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
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-tight text-plena-500">Plena</h1>
        <p className="text-xs text-slate-400">Gestão de Bebidas</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-plena-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800 mt-auto">
        <div className="text-xs text-slate-500 text-center leading-relaxed space-y-1">
          <p>&copy; 2025 Direitos Reservados</p>
          <p>
            Desenvolvido por{' '}
            <a 
              href="https://www.plenaaplicativos.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-plena-400 transition-colors duration-200 cursor-pointer"
              title="Conheça a Plena Aplicativos"
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