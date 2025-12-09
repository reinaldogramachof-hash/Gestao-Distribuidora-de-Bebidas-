import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Product, ProductCategory } from '../types';
import { Plus, Edit2, Trash2, Search, Package, ClipboardList, AlertTriangle } from 'lucide-react';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    setProducts(StorageService.getProducts());
  }, []);

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.price) return;
    
    const newProduct: Product = {
      id: currentProduct.id || Date.now().toString(),
      name: currentProduct.name,
      price: Number(currentProduct.price),
      cost: Number(currentProduct.cost || 0),
      stock: Number(currentProduct.stock || 0),
      minStock: Number(currentProduct.minStock || 10),
      category: currentProduct.category || ProductCategory.OTHERS,
      barcode: currentProduct.barcode
    };

    StorageService.saveProduct(newProduct);
    setProducts(StorageService.getProducts());
    setIsEditing(false);
    setCurrentProduct({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      StorageService.deleteProduct(id);
      setProducts(StorageService.getProducts());
    }
  };

  const openEdit = (product?: Product) => {
    setCurrentProduct(product || { category: ProductCategory.BEER });
    setIsEditing(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-plena-600" />
            Controle de Produtos
          </h2>
          <p className="text-sm text-slate-500 mt-1">Gerencie itens da Frente de Caixa e controle o estoque.</p>
        </div>
        <button 
          onClick={() => openEdit()}
          className="bg-plena-600 hover:bg-plena-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Plus size={18} /> Adicionar Item
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-plena-500 shadow-sm text-slate-900 bg-white placeholder-slate-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">Produto / Código</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Categoria</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Preço Venda</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Estoque</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{product.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{product.barcode || '---'}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-600 font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">R$ {product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${product.stock <= product.minStock ? 'text-red-600' : 'text-slate-700'}`}>
                        {product.stock}
                      </span>
                      {product.stock <= product.minStock && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Estoque Baixo"></span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(product)} className="text-plena-600 hover:bg-plena-50 p-2 rounded transition-colors" title="Editar"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Excluir"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <Package size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Nenhum produto encontrado no controle.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Alerts Section */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <AlertTriangle size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-800">Alerta de Reposição</h3>
             <p className="text-sm text-slate-600">Produtos que precisam de compra imediata.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {lowStockProducts.map(product => (
             <div key={product.id} className="bg-white border border-orange-100 p-3 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                   <p className="font-semibold text-slate-800 text-sm">{product.name}</p>
                   <p className="text-xs text-orange-600 font-medium">Estoque: {product.stock} (Mín: {product.minStock})</p>
                </div>
                <button 
                  onClick={() => openEdit(product)}
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-bold hover:bg-orange-200"
                >
                  Repor
                </button>
             </div>
          ))}
          {lowStockProducts.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-4 italic">
              Estoque saudável! Nenhum produto abaixo do mínimo.
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-slate-800">{currentProduct.id ? 'Editar Item' : 'Adicionar ao Controle'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  value={currentProduct.name || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-plena-500 focus:outline-none text-slate-900 bg-white"
                  placeholder="Ex: Cerveja Skol 350ml"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço Venda (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={currentProduct.price || ''} 
                    onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-plena-500 focus:outline-none text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Custo (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={currentProduct.cost || ''} 
                    onChange={e => setCurrentProduct({...currentProduct, cost: parseFloat(e.target.value)})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-plena-500 focus:outline-none text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Atual</label>
                  <input 
                    type="number" 
                    value={currentProduct.stock || ''} 
                    onChange={e => setCurrentProduct({...currentProduct, stock: parseFloat(e.target.value)})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-plena-500 focus:outline-none text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Mínimo</label>
                  <input 
                    type="number" 
                    value={currentProduct.minStock || ''} 
                    onChange={e => setCurrentProduct({...currentProduct, minStock: parseFloat(e.target.value)})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-plena-500 focus:outline-none text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select 
                  value={currentProduct.category} 
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value as ProductCategory})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-plena-500 focus:outline-none bg-white text-slate-900"
                >
                  {Object.values(ProductCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código de Barras (Opcional)</label>
                <input 
                  type="text" 
                  value={currentProduct.barcode || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, barcode: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-plena-500 focus:outline-none font-mono text-sm text-slate-900 bg-white"
                  placeholder="Escaneie ou digite..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 bg-plena-600 text-white rounded-lg hover:bg-plena-700 font-bold shadow-lg shadow-plena-500/20 transition-all">Salvar Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;