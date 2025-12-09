import React from 'react';
import { StorageService } from '../services/storage';
import { Calendar, Clock, CreditCard } from 'lucide-react';

const Sales: React.FC = () => {
  const sales = StorageService.getSales().sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Vendas</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">Data/Hora</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Produtos</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Pagamento</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50">
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
                      {sale.paymentMethod}
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-slate-800">
                    R$ {sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
               {sales.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    Nenhuma venda registrada ainda.
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

export default Sales;