import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, OrderEntity, ProductEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { OrderItem, Product } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { email, name } = (await c.req.json()) as { email?: string; name?: string };
    if (!isStr(email)) return bad(c, 'Email required');
    let user = await UserEntity.findByEmail(c.env, email);
    if (!user) {
      // Automatic first user promotion logic
      const userCount = await UserEntity.count(c.env);
      const role = userCount === 0 ? 'admin' : 'user';
      user = await UserEntity.create(c.env, {
        id: crypto.randomUUID(),
        name: name || email.split('@')[0],
        email,
        role
      });
    }
    return ok(c, user);
  });
  // PRODUCTS (Public)
  app.get('/api/products', async (c) => {
    await ProductEntity.ensureSeed(c.env);
    const { items } = await ProductEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new ProductEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c, 'Artifact not found');
    return ok(c, await entity.getState());
  });
  // ADMIN (Protected)
  app.post('/api/admin/products', async (c) => {
    const product = (await c.req.json()) as Product;
    if (!product.name) return bad(c, 'Name required');
    const created = await ProductEntity.create(c.env, {
      ...product,
      id: product.id || crypto.randomUUID()
    });
    return ok(c, created);
  });
  app.put('/api/admin/products/:id', async (c) => {
    const id = c.req.param('id');
    const data = (await c.req.json()) as Partial<Product>;
    const entity = new ProductEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    await entity.patch(data);
    return ok(c, await entity.getState());
  });
  app.delete('/api/admin/products/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProductEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // ORDERS
  app.get('/api/orders/me', async (c) => {
    const userId = c.req.query('userId');
    if (!isStr(userId)) return bad(c, 'userId required');
    const orders = await OrderEntity.listByUser(c.env, userId);
    return ok(c, orders);
  });
  app.post('/api/orders', async (c) => {
    const { userId, items, subtotal, shipping, total } = (await c.req.json()) as {
      userId: string;
      items: OrderItem[];
      subtotal: number;
      shipping: number;
      total: number;
    };
    if (!isStr(userId) || !items?.length) return bad(c, 'Invalid order payload');
    const order = await OrderEntity.create(c.env, {
      id: crypto.randomUUID(),
      userId,
      items,
      subtotal,
      shipping,
      total,
      status: 'processing',
      createdAt: Date.now()
    });
    return ok(c, order);
  });
}