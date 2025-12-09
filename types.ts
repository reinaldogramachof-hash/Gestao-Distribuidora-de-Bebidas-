export enum PaymentMethod {
  CASH = 'Dinheiro',
  PIX = 'Pix',
  CREDIT = 'Crédito',
  DEBIT = 'Débito'
}

export enum ProductCategory {
  BEER = 'Cervejas',
  SODA = 'Refrigerantes',
  WATER = 'Água',
  SPIRITS = 'Destilados',
  ICE = 'Gelo/Carvão',
  OTHERS = 'Outros'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category: ProductCategory;
  barcode?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  date: string; // ISO string
  timestamp: number;
}

export interface DashboardStats {
  todaySales: number;
  todayRevenue: number;
  lowStockCount: number;
  totalProducts: number;
}