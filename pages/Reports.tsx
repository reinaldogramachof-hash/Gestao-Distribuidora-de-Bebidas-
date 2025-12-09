import React, { useState, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { Calendar, Clock, CreditCard, Share2, FileText, TrendingUp, DollarSign, Filter, CalendarRange } from 'lucide-react';

const Reports: React.FC = () => {
  // Helper to get YYYY-MM-DD string
  const getTodayString = () => new Date().toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

  const allSales = StorageService.getSales();

  // Filter Logic
  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const saleDate = sale.date.split('T')[0];
      return saleDate >= startDate && saleDate <= endDate;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [allSales, startDate, endDate]);
  
  // Calculate Stats based on Filtered Data
  const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.total, 0);
  const totalSalesCount = filteredSales.length;
  
  // Calculate top selling items for the period
  const itemCounts: Record<string, number> = {};
  filteredSales.forEach(sale => {
    sale.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });
  const topItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => `${count}x ${name}`)
    .join(', ');

  // Quick Filter Handlers
  const setRangeToday = () => {
    const today = getTodayString();
    setStartDate(today);
    setEndDate(today);
  };

  const setRangeYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.toISOString().split('T')[0];
    setStartDate(y);
    setEndDate(y);
  };

  const setRangeLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setRangeThisMonth = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of current month
    // Handle edge case if current day < last day, usually end date is just today for "this month so far"
    // But let's set strictly to today for end date to avoid confusion
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(getTodayString());
  };

  const handleWhatsAppExport = () => {
    const startFmt = new Date(startDate + 'T12:00:00').toLocaleDateString('pt-BR');
    const endFmt = new Date(endDate + 'T12:00:00').toLocaleDateString('pt-BR');
    
    const periodString = startDate === endDate ? startFmt : `${startFmt} até ${endFmt}`;

    const reportText = `
📊 *Relatório Plena Bebidas*
📅 Período: ${periodString}

💰 *Faturamento:* R$ ${totalRevenue.toFixed(2)}
🛒 *Vendas:* ${totalSalesCount}
🏆 *Destaques:* ${topItems || 'Nenhum item'}

_Gerado automaticamente pelo Sistema Plena_
`.trim();

    const encodedText = encodeURIComponent(reportText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <FileText className="text-plena-600" />
             Relatórios Detalhados
           </h2>
           <p className="text-slate-500 text-sm mt-1">Analise o desempenho por período.</p>
        </div>
        <button 
          onClick={handleWhatsAppExport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-sm shadow-green-600/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Share2 size={18} />
          Exportar WhatsApp
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex-shrink-0">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Date Inputs */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 flex-1">
              <CalendarRange size={18} className="text-slate-500" />
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-slate-900 font-medium focus:outline-none text-sm"
                />
                <span className="text-slate-400">até</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-slate-900 font-medium focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <button onClick={setRangeToday} className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md whitespace-nowrap transition-colors">Hoje</button>
            <button onClick={setRangeYesterday} className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md whitespace-nowrap transition-colors">Ontem</button>
            <button onClick={setRangeLast7Days} className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md whitespace-nowrap transition-colors">7 Dias</button>
            <button onClick={setRangeThisMonth} className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md whitespace-nowrap transition-colors">Este Mês</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-slate-500 text-sm font-medium">Faturamento do Período</p>
               <p className="text-2xl font-bold text-slate-900 mt-1">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-plena-50 text-plena-600 rounded-lg">
               <DollarSign size={24} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-slate-500 text-sm font-medium">Vendas no Período</p>
               <p className="text-2xl font-bold text-slate-900 mt-1">{totalSalesCount} transações</p>
            </div>
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
               <TrendingUp size={24} />
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
           <h3 className="font-semibold text-slate-700">Extrato Filtrado</h3>
           <span className="text-xs text-slate-400 font-mono bg-white px-2 py-1 rounded border border-slate-200">
             {filteredSales.length} registros
           </span>
        </div>
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-white sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">Data/Hora</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Itens Vendidos</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Método</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar size={14} className="text-slate-400"/>
                      {new Date(sale.date).toLocaleDateString('pt-BR')}
                      <span className="text-slate-300">|</span>
                      <Clock size={14} className="text-slate-400"/>
                      {new Date(sale.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-700 max-w-md truncate">
                      {sale.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CreditCard size={14} />
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">{sale.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-slate-800">
                    R$ {sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
               {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter size={32} className="opacity-20" />
                      <p>Nenhuma venda encontrada neste período.</p>
                      <button onClick={setRangeThisMonth} className="text-sm text-plena-600 font-medium hover:underline">Ver este mês</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;