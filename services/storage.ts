import { Product, Sale } from '../types';

const PRODUCTS_KEY = 'plena_bebidas_products';
const SALES_KEY = 'plena_bebidas_sales';

// Helper to simulate delay for "real feel" (optional, kept at 0 for Plena speed)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const StorageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProduct: (product: Product): void => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  deleteProduct: (id: string): void => {
    const products = StorageService.getProducts().filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  updateStock: (items: { id: string; quantity: number }[]): void => {
    const products = StorageService.getProducts();
    items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        product.stock -= item.quantity;
      }
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  getSales: (): Sale[] => {
    const data = localStorage.getItem(SALES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSale: (sale: Sale): void => {
    const sales = StorageService.getSales();
    sales.push(sale);
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    
    // Auto update stock
    StorageService.updateStock(sale.items.map(i => ({ id: i.id, quantity: i.quantity })));
  },

  // Backup Features
  exportData: (): string => {
    const data = {
      products: StorageService.getProducts(),
      sales: StorageService.getSales(),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data.products));
      }
      if (data.sales && Array.isArray(data.sales)) {
        localStorage.setItem(SALES_KEY, JSON.stringify(data.sales));
      }
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  },

  // Seed initial data if empty or barely populated
  seedData: () => {
    const currentData = localStorage.getItem(PRODUCTS_KEY);
    const parsedData = currentData ? JSON.parse(currentData) : [];

    // If empty or just has the initial small sample (less than 5), populate full list
    if (!currentData || parsedData.length < 5) {
      const initialProducts: Product[] = [
        // --- CERVEJAS (Lata 350ml) ---
        { id: '101', name: 'Cerveja Skol Lata 350ml', price: 3.49, cost: 2.69, stock: 240, minStock: 48, category: 'Cervejas' as any },
        { id: '102', name: 'Cerveja Brahma Lata 350ml', price: 3.69, cost: 2.79, stock: 240, minStock: 48, category: 'Cervejas' as any },
        { id: '103', name: 'Cerveja Antarctica Lata 350ml', price: 3.49, cost: 2.69, stock: 120, minStock: 24, category: 'Cervejas' as any },
        { id: '104', name: 'Cerveja Itaipava Lata 350ml', price: 2.99, cost: 2.19, stock: 360, minStock: 60, category: 'Cervejas' as any },
        { id: '105', name: 'Cerveja Heineken Lata 350ml', price: 5.49, cost: 4.20, stock: 120, minStock: 24, category: 'Cervejas' as any },
        { id: '106', name: 'Cerveja Amstel Lata 350ml', price: 4.29, cost: 3.30, stock: 120, minStock: 24, category: 'Cervejas' as any },
        { id: '107', name: 'Cerveja Budweiser Lata 350ml', price: 4.49, cost: 3.40, stock: 100, minStock: 24, category: 'Cervejas' as any },
        { id: '108', name: 'Cerveja Spaten Lata 350ml', price: 4.89, cost: 3.80, stock: 150, minStock: 30, category: 'Cervejas' as any },
        { id: '109', name: 'Cerveja Stella Artois Lata 350ml', price: 5.19, cost: 3.99, stock: 80, minStock: 20, category: 'Cervejas' as any },
        { id: '110', name: 'Cerveja Tiger Lata 350ml', price: 3.99, cost: 2.99, stock: 60, minStock: 12, category: 'Cervejas' as any },
        { id: '111', name: 'Cerveja Império Lata 350ml', price: 3.79, cost: 2.89, stock: 60, minStock: 12, category: 'Cervejas' as any },
        
        // --- CERVEJAS (Latão 473ml) ---
        { id: '120', name: 'Cerveja Skol Latão 473ml', price: 4.49, cost: 3.50, stock: 240, minStock: 48, category: 'Cervejas' as any },
        { id: '121', name: 'Cerveja Brahma Latão 473ml', price: 4.79, cost: 3.70, stock: 240, minStock: 48, category: 'Cervejas' as any },
        { id: '122', name: 'Cerveja Heineken Latão 473ml', price: 6.99, cost: 5.50, stock: 120, minStock: 24, category: 'Cervejas' as any },
        { id: '123', name: 'Cerveja Amstel Latão 473ml', price: 5.29, cost: 4.10, stock: 100, minStock: 24, category: 'Cervejas' as any },
        { id: '124', name: 'Cerveja Itaipava Latão 473ml', price: 3.89, cost: 2.90, stock: 200, minStock: 40, category: 'Cervejas' as any },
        { id: '125', name: 'Cerveja Budweiser Latão 473ml', price: 5.49, cost: 4.30, stock: 80, minStock: 12, category: 'Cervejas' as any },

        // --- CERVEJAS (Garrafa 600ml / Litrão) ---
        { id: '130', name: 'Cerveja Skol 600ml (Retornável)', price: 8.00, cost: 6.00, stock: 48, minStock: 12, category: 'Cervejas' as any },
        { id: '131', name: 'Cerveja Brahma 600ml (Retornável)', price: 8.50, cost: 6.50, stock: 48, minStock: 12, category: 'Cervejas' as any },
        { id: '132', name: 'Cerveja Heineken 600ml (Retornável)', price: 11.00, cost: 8.50, stock: 48, minStock: 12, category: 'Cervejas' as any },
        { id: '133', name: 'Cerveja Original 600ml', price: 9.50, cost: 7.20, stock: 36, minStock: 12, category: 'Cervejas' as any },
        { id: '134', name: 'Cerveja Skol Litrão', price: 10.00, cost: 7.80, stock: 60, minStock: 12, category: 'Cervejas' as any },
        { id: '135', name: 'Cerveja Brahma Litrão', price: 10.50, cost: 8.20, stock: 60, minStock: 12, category: 'Cervejas' as any },
        
        // --- CERVEJAS (Long Neck) ---
        { id: '140', name: 'Cerveja Heineken Long Neck', price: 7.50, cost: 5.50, stock: 72, minStock: 24, category: 'Cervejas' as any },
        { id: '141', name: 'Cerveja Stella Artois Long Neck', price: 6.50, cost: 4.80, stock: 48, minStock: 12, category: 'Cervejas' as any },
        { id: '142', name: 'Cerveja Budweiser Long Neck', price: 6.00, cost: 4.50, stock: 48, minStock: 12, category: 'Cervejas' as any },
        { id: '143', name: 'Cerveja Corona Extra Long Neck', price: 8.50, cost: 6.20, stock: 48, minStock: 12, category: 'Cervejas' as any },
        { id: '144', name: 'Cerveja Malzbier Brahma LN', price: 6.50, cost: 4.80, stock: 24, minStock: 6, category: 'Cervejas' as any },

        // --- REFRIGERANTES (Lata) ---
        { id: '201', name: 'Coca-Cola Lata 350ml', price: 4.50, cost: 3.20, stock: 120, minStock: 24, category: 'Refrigerantes' as any },
        { id: '202', name: 'Coca-Cola Zero Lata 350ml', price: 4.50, cost: 3.20, stock: 60, minStock: 12, category: 'Refrigerantes' as any },
        { id: '203', name: 'Guaraná Antarctica Lata 350ml', price: 4.00, cost: 2.80, stock: 60, minStock: 12, category: 'Refrigerantes' as any },
        { id: '204', name: 'Fanta Laranja Lata 350ml', price: 4.00, cost: 2.80, stock: 48, minStock: 12, category: 'Refrigerantes' as any },
        { id: '205', name: 'Fanta Uva Lata 350ml', price: 4.00, cost: 2.80, stock: 24, minStock: 6, category: 'Refrigerantes' as any },
        { id: '206', name: 'Sprite Lata 350ml', price: 4.00, cost: 2.80, stock: 36, minStock: 6, category: 'Refrigerantes' as any },
        { id: '207', name: 'Schweppes Citrus Lata 350ml', price: 5.00, cost: 3.50, stock: 24, minStock: 6, category: 'Refrigerantes' as any },
        { id: '208', name: 'Pepsi Lata 350ml', price: 3.80, cost: 2.70, stock: 36, minStock: 6, category: 'Refrigerantes' as any },

        // --- REFRIGERANTES (2 Litros) ---
        { id: '220', name: 'Coca-Cola 2L', price: 10.00, cost: 7.50, stock: 60, minStock: 12, category: 'Refrigerantes' as any },
        { id: '221', name: 'Coca-Cola Zero 2L', price: 10.00, cost: 7.50, stock: 24, minStock: 6, category: 'Refrigerantes' as any },
        { id: '222', name: 'Guaraná Antarctica 2L', price: 8.50, cost: 6.50, stock: 48, minStock: 12, category: 'Refrigerantes' as any },
        { id: '223', name: 'Fanta Laranja 2L', price: 8.50, cost: 6.50, stock: 24, minStock: 6, category: 'Refrigerantes' as any },
        { id: '224', name: 'Sprite 2L', price: 8.50, cost: 6.50, stock: 12, minStock: 6, category: 'Refrigerantes' as any },
        { id: '225', name: 'Pepsi 2L', price: 8.00, cost: 6.00, stock: 12, minStock: 6, category: 'Refrigerantes' as any },
        { id: '226', name: 'Sukita Laranja 2L', price: 7.00, cost: 5.20, stock: 12, minStock: 6, category: 'Refrigerantes' as any },
        { id: '227', name: 'Dolly Guaraná 2L', price: 5.50, cost: 3.80, stock: 24, minStock: 6, category: 'Refrigerantes' as any },
        { id: '228', name: 'Itubaína 2L', price: 6.50, cost: 4.80, stock: 12, minStock: 6, category: 'Refrigerantes' as any },

        // --- REFRIGERANTES (600ml / KS) ---
        { id: '240', name: 'Coca-Cola 600ml', price: 6.00, cost: 4.20, stock: 24, minStock: 6, category: 'Refrigerantes' as any },
        { id: '241', name: 'Coca-Cola KS (Vidro)', price: 4.50, cost: 3.00, stock: 48, minStock: 12, category: 'Refrigerantes' as any },
        { id: '242', name: 'Guaraná 600ml', price: 5.50, cost: 3.80, stock: 12, minStock: 6, category: 'Refrigerantes' as any },

        // --- ÁGUA E ENERGÉTICOS ---
        { id: '301', name: 'Água Mineral s/ Gás 500ml', price: 2.50, cost: 1.20, stock: 100, minStock: 24, category: 'Água' as any },
        { id: '302', name: 'Água Mineral c/ Gás 500ml', price: 3.00, cost: 1.50, stock: 60, minStock: 12, category: 'Água' as any },
        { id: '303', name: 'Água Mineral 1.5L', price: 4.00, cost: 2.20, stock: 24, minStock: 6, category: 'Água' as any },
        { id: '304', name: 'Água Galão 20L', price: 15.00, cost: 8.00, stock: 10, minStock: 3, category: 'Água' as any },
        { id: '310', name: 'Energético Red Bull 250ml', price: 9.00, cost: 6.50, stock: 48, minStock: 12, category: 'Outros' as any },
        { id: '311', name: 'Energético Red Bull Tropical 250ml', price: 9.00, cost: 6.50, stock: 24, minStock: 6, category: 'Outros' as any },
        { id: '312', name: 'Energético Monster 473ml', price: 10.00, cost: 7.20, stock: 36, minStock: 12, category: 'Outros' as any },
        { id: '313', name: 'Energético Baly 2L', price: 12.00, cost: 8.50, stock: 12, minStock: 6, category: 'Outros' as any },

        // --- DESTILADOS (Whisky) ---
        { id: '401', name: 'Whisky Red Label 1L', price: 110.00, cost: 85.00, stock: 6, minStock: 2, category: 'Destilados' as any },
        { id: '402', name: 'Whisky Black Label 1L', price: 180.00, cost: 140.00, stock: 3, minStock: 1, category: 'Destilados' as any },
        { id: '403', name: 'Whisky White Horse 1L', price: 85.00, cost: 65.00, stock: 6, minStock: 2, category: 'Destilados' as any },
        { id: '404', name: 'Whisky Old Parr 1L', price: 160.00, cost: 125.00, stock: 3, minStock: 1, category: 'Destilados' as any },
        { id: '405', name: 'Whisky Passport 1L', price: 55.00, cost: 40.00, stock: 6, minStock: 2, category: 'Destilados' as any },
        { id: '406', name: 'Whisky Jack Daniels 1L', price: 170.00, cost: 130.00, stock: 4, minStock: 1, category: 'Destilados' as any },
        { id: '407', name: 'Whisky Ballantines Finest 1L', price: 90.00, cost: 70.00, stock: 5, minStock: 1, category: 'Destilados' as any },

        // --- DESTILADOS (Vodka/Gin) ---
        { id: '420', name: 'Vodka Smirnoff 998ml', price: 45.00, cost: 32.00, stock: 12, minStock: 4, category: 'Destilados' as any },
        { id: '421', name: 'Vodka Absolut 1L', price: 100.00, cost: 75.00, stock: 6, minStock: 2, category: 'Destilados' as any },
        { id: '422', name: 'Vodka Orloff 1L', price: 32.00, cost: 22.00, stock: 12, minStock: 4, category: 'Destilados' as any },
        { id: '423', name: 'Gin Tanqueray 750ml', price: 120.00, cost: 90.00, stock: 4, minStock: 1, category: 'Destilados' as any },
        { id: '424', name: 'Gin Seagers 1L', price: 45.00, cost: 32.00, stock: 6, minStock: 2, category: 'Destilados' as any },
        { id: '425', name: 'Gin Rocks 1L', price: 38.00, cost: 26.00, stock: 6, minStock: 2, category: 'Destilados' as any },

        // --- DESTILADOS (Cachaça/Outros) ---
        { id: '440', name: 'Cachaça 51 965ml', price: 15.00, cost: 10.50, stock: 24, minStock: 6, category: 'Destilados' as any },
        { id: '441', name: 'Cachaça Velho Barreiro 910ml', price: 16.00, cost: 11.00, stock: 12, minStock: 6, category: 'Destilados' as any },
        { id: '442', name: 'Cachaça Ypióca Ouro 960ml', price: 18.00, cost: 12.50, stock: 12, minStock: 4, category: 'Destilados' as any },
        { id: '443', name: 'Campari 900ml', price: 55.00, cost: 40.00, stock: 6, minStock: 2, category: 'Destilados' as any },
        { id: '444', name: 'Conhaque Dreher 900ml', price: 20.00, cost: 14.00, stock: 12, minStock: 4, category: 'Destilados' as any },
        { id: '445', name: 'Jurupinga 700ml', price: 25.00, cost: 18.00, stock: 12, minStock: 4, category: 'Destilados' as any },
        { id: '446', name: 'Corote Sabores 500ml', price: 5.00, cost: 3.00, stock: 48, minStock: 12, category: 'Destilados' as any },
        { id: '447', name: 'Ice 51 Limão 275ml', price: 6.00, cost: 4.00, stock: 24, minStock: 6, category: 'Destilados' as any },
        { id: '448', name: 'Beats Senses Lata 269ml', price: 6.50, cost: 4.50, stock: 24, minStock: 6, category: 'Destilados' as any },

        // --- GELO, CARVÃO E OUTROS ---
        { id: '501', name: 'Gelo Cubo 5kg', price: 12.00, cost: 7.00, stock: 30, minStock: 10, category: 'Gelo/Carvão' as any },
        { id: '502', name: 'Gelo Escama 10kg', price: 20.00, cost: 12.00, stock: 10, minStock: 3, category: 'Gelo/Carvão' as any },
        { id: '503', name: 'Gelo Britado 3kg', price: 8.00, cost: 4.50, stock: 15, minStock: 5, category: 'Gelo/Carvão' as any },
        { id: '504', name: 'Carvão Vegetal 3kg', price: 18.00, cost: 12.00, stock: 20, minStock: 5, category: 'Gelo/Carvão' as any },
        { id: '505', name: 'Carvão Vegetal 5kg', price: 28.00, cost: 19.00, stock: 20, minStock: 5, category: 'Gelo/Carvão' as any },
        { id: '601', name: 'Isqueiro Bic Grande', price: 6.00, cost: 3.50, stock: 50, minStock: 10, category: 'Outros' as any },
        { id: '602', name: 'Isqueiro Bic Pequeno', price: 4.00, cost: 2.50, stock: 50, minStock: 10, category: 'Outros' as any },
        { id: '603', name: 'Copo Americano 190ml', price: 3.00, cost: 1.50, stock: 24, minStock: 6, category: 'Outros' as any },
        { id: '604', name: 'Salgadinho Torcida 70g', price: 3.50, cost: 2.00, stock: 30, minStock: 10, category: 'Outros' as any },
        { id: '605', name: 'Batata Pringles 114g', price: 15.00, cost: 10.00, stock: 12, minStock: 4, category: 'Outros' as any },
      ];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    }
  }
};