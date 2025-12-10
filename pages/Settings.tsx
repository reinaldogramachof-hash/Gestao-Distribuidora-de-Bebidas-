import React, { useRef, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Download, Upload, ShieldCheck, Database, Smartphone, Wifi, Share, PlusSquare, MonitorDown } from 'lucide-react';

const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Check if app is already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Para instalar, utilize a opção 'Adicionar à Tela Inicial' no menu do seu navegador.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleExport = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_plena_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (StorageService.importData(content)) {
          alert('Dados restaurados com sucesso! A página será recarregada.');
          window.location.reload();
        } else {
          alert('Erro ao importar arquivo. Verifique se é um backup válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto h-full overflow-y-auto pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Configurações & Dados</h2>

      {/* App Install Section - ANDROID/DESKTOP */}
      {!isInstalled && !isIOS && (
        <div className="bg-gradient-to-r from-indigo-600 to-plena-600 rounded-xl p-6 text-white shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Instalar Aplicativo</h3>
              <p className="text-indigo-100 text-sm">Tenha o Plena direto na sua tela inicial.</p>
            </div>
          </div>
          <button 
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap"
          >
            {deferredPrompt ? 'Instalar Agora' : 'Como Instalar?'}
          </button>
        </div>
      )}

      {/* App Install Section - iOS ONLY */}
      {!isInstalled && isIOS && (
        <div className="bg-slate-800 rounded-xl p-6 text-white shadow-lg mb-6 border border-slate-700">
          <div className="flex gap-4 items-center mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Instalar no iPhone/iPad</h3>
              <p className="text-slate-400 text-sm">Siga os passos abaixo:</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-300 bg-slate-900/50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <p>Toque no botão <Share size={16} className="inline mx-1"/> <span className="font-bold text-white">Compartilhar</span> na barra inferior.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <p>Role para cima e toque em <span className="font-bold text-white">Adicionar à Tela de Início</span>.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <p>Confirme clicando em <span className="font-bold text-white">Adicionar</span> no canto superior.</p>
            </div>
          </div>
        </div>
      )}

      {/* Internet Requirement Notice */}
      <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-100 p-4 mb-6 flex items-start gap-4">
        <Wifi className="w-6 h-6 text-amber-500 flex-shrink-0" />
        <div>
          <h4 className="text-amber-800 font-bold mb-1">Conexão Necessária</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            Para garantir o carregamento correto de ícones e atualizações, mantenha o dispositivo conectado à Internet ao abrir o app.
          </p>
        </div>
      </div>

      {/* Backup Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-plena-100 rounded-lg text-plena-600">
             <Database size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Backup Local</h3>
            <p className="text-slate-500 text-sm">
              Seus dados ficam salvos no navegador. Faça o download regularmente para evitar perda de dados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleExport}
            className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 hover:border-plena-500 hover:bg-plena-50 rounded-xl transition-all group"
          >
            <Download className="w-8 h-8 text-slate-400 group-hover:text-plena-600 mb-3" />
            <span className="font-bold text-slate-700 group-hover:text-plena-700">Baixar Backup (PC/Mobile)</span>
            <span className="text-xs text-slate-400 mt-1">Salvar arquivo .json</span>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all group"
          >
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-green-600 mb-3" />
            <span className="font-bold text-slate-700 group-hover:text-green-700">Restaurar Dados</span>
            <span className="text-xs text-slate-400 mt-1">Carregar arquivo .json</span>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-300 rounded-xl p-6 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-plena-400 flex-shrink-0" />
        <div>
          <h4 className="text-white font-bold mb-1">Privacidade & Dados</h4>
          <p className="text-sm leading-relaxed">
            A Plena não tem acesso aos seus dados financeiros. Tudo é processado localmente no seu dispositivo. 
            Mantenha seu backup em dia.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-slate-400">
        <p>Versão Mobile Otimizada 2.2</p>
      </div>
    </div>
  );
};

export default Settings;