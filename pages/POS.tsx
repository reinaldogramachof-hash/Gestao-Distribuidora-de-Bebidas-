import React, { useState, useEffect, useRef } from 'react';
import { StorageService } from '../services/storage';
import { Product, CartItem, Sale, PaymentMethod } from '../types';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, CheckCircle, ShoppingBag } from 'lucide-react';

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProducts(StorageService.getProducts());
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search);
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsModalOpen(true);
  };

  const finalizeSale = () => {
    const sale: Sale = {
      id: Date.now().toString(),
      items: cart,
      total: cartTotal,
      paymentMethod,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    StorageService.saveSale(sale);
    setCart([]);
    setIsModalOpen(false);
    setProducts(StorageService.getProducts()); // Refresh stock display
    alert('Venda realizada com sucesso!');
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Product Area */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Search & Filter */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Buscar por nome ou código de barras..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-plena-500 shadow-sm text-slate-900 bg-white placeholder-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-plena-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pr-2">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-plena-300 transition-all flex flex-col items-start text-left group"
            >
              <div className="w-full aspect-video bg-slate-50 rounded-lg mb-3 flex items-center justify-center text-slate-300">
                {/* Placeholder for image */}
                <span className="text-2xl font-bold opacity-30">{product.name.charAt(0)}</span>
              </div>
              <h3 className="font-semibold text-slate-800 leading-tight line-clamp-2">{product.name}</h3>
              <div className="flex justify-between items-end w-full mt-2">
                <span className="text-sm text-slate-500">{product.stock} un.</span>
                <span className="font-bold text-plena-600 text-lg">R$ {product.price.toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="bg-plena-100 p-2 rounded-lg text-plena-600">
               <ShoppingBag className="w-5 h-5" />
            </div>
            Cesta de Compras
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Sua cesta está vazia</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                  <div className="text-xs text-slate-500 mt-1">Unit: R$ {item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus size={14} /></button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus size={14} /></button>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</div>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-600 mt-1">Remover</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500">Total</span>
            <span className="text-3xl font-bold text-slate-900">R$ {cartTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-plena-600 hover:bg-plena-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-plena-500/20 transition-all active:scale-[0.98]"
          >
            Finalizar Venda (F9)
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Pagamento</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.CASH ? 'border-plena-500 bg-plena-50 text-plena-700 ring-1 ring-plena-500' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <Banknote />
                    <span className="font-medium">Dinheiro</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.PIX)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.PIX ? 'border-plena-500 bg-plena-50 text-plena-700 ring-1 ring-plena-500' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <Smartphone />
                    <span className="font-medium">Pix</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.CREDIT)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.CREDIT ? 'border-plena-500 bg-plena-50 text-plena-700 ring-1 ring-plena-500' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <CreditCard />
                    <span className="font-medium">Crédito</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.DEBIT)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.DEBIT ? 'border-plena-500 bg-plena-50 text-plena-700 ring-1 ring-plena-500' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <CreditCard />
                    <span className="font-medium">Débito</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl mt-6 flex justify-between items-center">
                  <span className="text-lg font-medium text-slate-600">Total a Pagar</span>
                  <span className="text-2xl font-bold text-slate-900">R$ {cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={finalizeSale}
                className="flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;