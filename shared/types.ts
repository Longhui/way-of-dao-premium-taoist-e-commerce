export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'admin' | 'user';
export interface Address {
  fullName: string;
  street: string;
  city: string;
  zipCode: string;
  phone?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Mock hashed
  role: UserRole;
  address?: Address;
}
export interface UserSession {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  role: UserRole;
}
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: number;
}
export interface Product {
  id: string;
  name: string;
  category: 'Incense' | 'Literature' | 'Artifacts' | 'Attire';
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  images?: string[];
  specifications: Record<string, string>;
  dimensions?: string;
  weight?: string;
  createdAt?: number;
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
export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'shipped' 
  | 'in-transit' 
  | 'delivered' 
  | 'completed' 
  | 'reviewed'
  | 'cancelled';
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  address?: Address;
  trackingNumber?: string;
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