import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Initialize default data if empty (First run experience)
    StorageService.seedData();
  }, []);

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
    <div className="flex h-screen w-screen bg-gray-50 font-sans text-slate-900">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 h-full overflow-hidden relative">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;