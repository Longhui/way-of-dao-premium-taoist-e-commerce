import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, OrderEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { OrderItem } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Way of Dao API' }}));
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { email, name } = (await c.req.json()) as { email?: string; name?: string };
    if (!isStr(email)) return bad(c, 'Email required');
    let user = await UserEntity.findByEmail(c.env, email);
    if (!user) {
      user = await UserEntity.create(c.env, { 
        id: crypto.randomUUID(), 
        name: name || email.split('@')[0], 
        email 
      });
    }
    return ok(c, user);
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
  // USERS (Admin/Debug)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
}