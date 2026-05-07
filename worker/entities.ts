import { IndexedEntity, Env, Index } from "./core-utils";
import type { User, Order, Product, Review } from "@shared/types";
import { MOCK_PRODUCTS, MOCK_USERS } from "@shared/mock-data";
/**
 * User Entity: Stores persistent user profile information.
 */
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "", role: 'user' };
  static seedData = MOCK_USERS.map(u => ({ ...u, email: `${u.name.toLowerCase().replace(' ', '')}@dao.com`, role: u.id === 'u1' ? 'admin' : 'user' })) as User[];
  static async findByEmail(env: Env, email: string): Promise<User | null> {
    const { items } = await this.list(env);
    return items.find(u => u.email === email) || null;
  }
  static async count(env: Env): Promise<number> {
    const idx = new Index<string>(env, this.indexName);
    const all = await idx.list();
    return all.length;
  }
}
/**
 * Product Entity: Dynamic Artifact Catalog.
 */
export class ProductEntity extends IndexedEntity<Product> {
  static readonly entityName = "product";
  static readonly indexName = "products";
  static readonly initialState: Product = {
    id: "",
    name: "",
    category: 'Artifacts',
    price: 0,
    description: "",
    imageUrl: "",
    specifications: {},
    createdAt: Date.now()
  };
  static seedData = MOCK_PRODUCTS.map(p => ({ ...p, createdAt: Date.now() })) as Product[];
}
/**
 * Review Entity: Product reflections.
 */
export class ReviewEntity extends IndexedEntity<Review> {
  static readonly entityName = "review";
  static readonly indexName = "reviews";
  static readonly initialState: Review = {
    id: "",
    productId: "",
    userId: "",
    userName: "",
    rating: 5,
    text: "",
    createdAt: Date.now()
  };
  static async listByProduct(env: Env, productId: string): Promise<Review[]> {
    const { items } = await this.list(env);
    return items
      .filter(r => r.productId === productId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
}
/**
 * Order Entity: Stores transaction records.
 */
export class OrderEntity extends IndexedEntity<Order> {
  static readonly entityName = "order";
  static readonly indexName = "orders";
  static readonly initialState: Order = {
    id: "",
    userId: "",
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
    status: 'pending',
    createdAt: 0
  };
  static async listByUser(env: Env, userId: string): Promise<Order[]> {
    const { items } = await this.list(env);
    return items
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  static async listAll(env: Env): Promise<Order[]> {
    const { items } = await this.list(env);
    return items.sort((a, b) => b.createdAt - a.createdAt);
  }
}