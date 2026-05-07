import { IndexedEntity, Env, Index } from "./core-utils";
import type { User, Chat, ChatMessage, Order, Product } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_PRODUCTS } from "@shared/mock-data";
/**
 * User Entity: Stores persistent user profile information.
 */
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", role: 'user' };
  static seedData = MOCK_USERS;
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
    specifications: {}
  };
  static seedData = MOCK_PRODUCTS;
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
}
/**
 * Chat Board Entity: Handles group discussions and message history.
 */
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: (MOCK_CHAT_MESSAGES as ChatMessage[]).filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const state = await this.getState();
    return state.messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      chatId: this.id,
      userId,
      text,
      ts: Date.now()
    };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}