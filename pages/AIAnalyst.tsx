import React, { useState } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { generateInsights } from '../services/aiService';
import { StorageService } from '../services/storage';
import ReactMarkdown from 'react-markdown';

const AIAnalyst: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    const sales = StorageService.getSales();
    const products = StorageService.getProducts();
    
    // Simulate thinking for UX
    const result = await generateInsights(sales, products);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-plena-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
          <Bot className="text-white w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Consultor Inteligente Plena</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Nossa IA analisa suas vendas e estoque para sugerir promoções, reposições e dicas para vender mais.
        </p>
      </div>

      {!insight && !loading && (
        <div className="flex justify-center">
          <button 
            onClick={handleAnalysis}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 hover:shadow-xl hover:-translate-y-1"
          >
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400 animate-pulse" />
            Gerar Análise do Negócio
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-plena-600 animate-spin mb-4" />
          <p className="text-slate-500 animate-pulse">Analisando seus dados de vendas...</p>
        </div>
      )}

      {insight && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-slate max-w-none">
             {/* Using a simple pre-wrap for now as we don't have a full markdown renderer installed in this environment, 
                 but typically this would use ReactMarkdown. Since we can't install deps, we use a basic render. */}
             <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {insight}
             </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
             <button 
                onClick={() => setInsight(null)}
                className="text-slate-500 hover:text-plena-600 text-sm font-medium"
             >
                Nova Análise
             </button>
          </div>
        </div>
      )}
      
      <div className="mt-12 text-center text-xs text-slate-400">
        <p>A inteligência artificial pode cometer erros. Verifique as informações importantes.</p>
      </div>
    </div>
  );
};

export default AIAnalyst;