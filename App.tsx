import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { StorageService } from './services/storage';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize default data if empty (First run experience)
    StorageService.seedData();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close menu on mobile navigation
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'pos': return <POS />;
      case 'control': return <Inventory />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-lg tracking-tight text-plena-500">Plena Bebidas</span>
        </div>
      </div>

      {/* Sidebar - Mobile Overlay & Desktop Static */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative pt-16 md:pt-0 bg-gray-50">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;