import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, OrderEntity, ProductEntity, ReviewEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { OrderItem, Product, Review, OrderStatus, User } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH
  app.post('/api/auth/register', async (c) => {
    const { email, name, password } = (await c.req.json()) as { email?: string; name?: string; password?: string };
    if (!isStr(email) || !isStr(password)) return bad(c, 'Email and password required');
    const existing = await UserEntity.findByEmail(c.env, email);
    if (existing) return bad(c, 'Soul already registered');
    const userCount = await UserEntity.count(c.env);
    const role = userCount === 0 ? 'admin' : 'user';
    const user = await UserEntity.create(c.env, {
      id: crypto.randomUUID(),
      name: name || email.split('@')[0],
      email,
      password: `hash_${password}`, // Simple mock hash
      role
    });
    return ok(c, user);
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password } = (await c.req.json()) as { email?: string; password?: string };
    // Hidden Admin Bypass
    if (email === 'admin' && password === '1234') {
      const admin = await UserEntity.findByEmail(c.env, 'masterzhou@dao.com');
      return ok(c, admin || { id: 'u1', name: 'Master Zhou', role: 'admin', email: 'admin@wayofdao.com' });
    }
    if (!isStr(email)) return bad(c, 'Email required');
    const user = await UserEntity.findByEmail(c.env, email);
    if (!user) return bad(c, 'Soul not found');
    if (user.password && user.password !== `hash_${password}`) return bad(c, 'Invalid path (credentials)');
    return ok(c, user);
  });
  // PRODUCTS
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
  // REVIEWS
  app.get('/api/reviews/:productId', async (c) => {
    const productId = c.req.param('productId');
    const reviews = await ReviewEntity.listByProduct(c.env, productId);
    return ok(c, reviews);
  });
  app.post('/api/reviews', async (c) => {
    const review = (await c.req.json()) as Review;
    if (!review.productId || !review.userId || !review.rating) return bad(c, 'Invalid review');
    const created = await ReviewEntity.create(c.env, {
      ...review,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    });
    return ok(c, created);
  });
  // ORDERS
  app.get('/api/orders/me', async (c) => {
    const userId = c.req.query('userId');
    if (!isStr(userId)) return bad(c, 'userId required');
    const orders = await OrderEntity.listByUser(c.env, userId);
    return ok(c, orders);
  });
  app.post('/api/orders', async (c) => {
    const orderData = await c.req.json();
    const order = await OrderEntity.create(c.env, {
      ...orderData,
      id: crypto.randomUUID(),
      status: 'paid', // Mock successful payment
      createdAt: Date.now()
    });
    return ok(c, order);
  });
  // ADMIN
  app.get('/api/admin/orders', async (c) => {
    const orders = await OrderEntity.listAll(c.env);
    return ok(c, orders);
  });
  app.patch('/api/admin/orders/:id', async (c) => {
    const id = c.req.param('id');
    const update = await c.req.json();
    const entity = new OrderEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    await entity.patch(update);
    return ok(c, await entity.getState());
  });
  app.post('/api/admin/products', async (c) => {
    const product = (await c.req.json()) as Product;
    const created = await ProductEntity.create(c.env, {
      ...product,
      id: product.id || crypto.randomUUID(),
      createdAt: Date.now()
    });
    return ok(c, created);
  });
  app.put('/api/admin/products/:id', async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    const entity = new ProductEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    await entity.patch(data);
    return ok(c, await entity.getState());
  });
  app.delete('/api/admin/products/:id', async (c) => {
    const id = c.req.param('id');
    await ProductEntity.delete(c.env, id);
    return ok(c, { success: true });
  });
}