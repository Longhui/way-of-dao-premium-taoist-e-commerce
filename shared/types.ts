export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'admin' | 'user';
export interface User {
  id: string;
  name: string;
  email?: string;
  role?: UserRole;
}
export interface UserSession {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  role: UserRole;
}
export interface Product {
  id: string;
  name: string;
  category: 'Incense' | 'Literature' | 'Artifacts' | 'Attire';
  price: number;
  description: string;
  imageUrl: string;
  specifications: Record<string, string>;
}
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
}
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}