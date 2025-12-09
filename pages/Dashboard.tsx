import React, { useMemo } from 'react';
import { StorageService } from '../services/storage';
import { DollarSign, ShoppingBag, AlertTriangle, Package, Calendar, Clock, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const sales = StorageService.getSales();
  const products = StorageService.getProducts();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySalesData = sales.filter(s => s.date.startsWith(today));
    
    return {
      revenue: todaySalesData.reduce((acc, curr) => acc + curr.total, 0),
      count: todaySalesData.length,
      lowStock: products.filter(p => p.stock <= p.minStock).length,
      totalProducts: products.length
    };
  }, [sales, products]);

  // Chart Data: Last 7 days revenue
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayRevenue = sales
        .filter(s => s.date.startsWith(date))
        .reduce((acc, curr) => acc + curr.total, 0);
      return {
        name: date.split('-').slice(1).join('/'), // MM/DD
        vendas: dayRevenue
      };
    });
  }, [sales]);

  const recentSales = [...sales].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
        <span className="text-sm text-slate-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Faturamento Hoje</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">R$ {stats.revenue.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Vendas Hoje</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.count}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Estoque Baixo</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.lowStock}</h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Produtos Totais</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalProducts}</h3>
            </div>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Package size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section - Full Width */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Faturamento nos Últimos 7 Dias</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="vendas" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Últimas Vendas Realizadas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">Data/Hora</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Produtos</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Pagamento</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.map(sale => (
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
              {recentSales.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Nenhuma venda recente.
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

export default Dashboard;