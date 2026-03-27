export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  material?: string;
  label?: string | null;
  inStock: boolean;
  images: string[];
  options?: string;
  categoryId: number;
  category: Category;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface Order {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  comment?: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
