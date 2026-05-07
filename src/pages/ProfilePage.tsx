import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Order, OrderStatus } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, ChevronRight, LogOut, ShoppingBag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
export function ProfilePage() {
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const logout = useAuth((s) => s.logout);
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => api<Order[]>(`/api/orders/me?userId=${user?.id}`),
    enabled: !!user?.id,
  });
  if (!isAuthenticated) return <Navigate to="/auth" />;
  const statusProgress: Record<OrderStatus, number> = {
    pending: 10,
    paid: 25,
    processing: 40,
    shipped: 60,
    'in-transit': 80,
    delivered: 100,
    completed: 100,
    reviewed: 100,
    cancelled: 0
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-dao-jade mb-2">
            Peace be with you, <span className="text-dao-gold italic">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={() => logout()} className="border-dao-jade/20 text-dao-jade hover:bg-destructive hover:text-white transition-all">
          <LogOut className="w-4 h-4 mr-2" /> End Session
        </Button>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <h2 className="text-xl font-display font-bold text-dao-jade mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-dao-gold" /> History of Acquisitions
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => <div key={n} className="h-32 w-full bg-dao-jade/5 animate-pulse rounded-sm" />)}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="bg-white border border-dao-jade/5 p-12 text-center rounded-sm space-y-6">
              <Package className="w-12 h-12 text-dao-jade/10 mx-auto" />
              <p className="text-dao-jade font-medium">Your path is currently clear of artifacts.</p>
              <Button asChild variant="outline" className="border-dao-jade/20 text-dao-jade hover:bg-dao-jade hover:text-dao-paper">
                <Link to="/shop">Begin the Journey</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-dao-jade/5 p-6 rounded-sm hover:shadow-soft transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-dao-jade uppercase tracking-widest">Order #{order.id.slice(0, 8)}</span>
                        <Badge className="bg-dao-gold/20 text-dao-jade border-none uppercase text-[10px]">{order.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-dao-jade">${order.total.toFixed(2)}</p>
                      {order.trackingNumber && (
                        <p className="text-[10px] text-dao-gold uppercase font-bold mt-1">Track: {order.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-dao-jade/5 rounded-full overflow-hidden mb-8">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${statusProgress[order.status]}%` }} className="h-full bg-dao-gold transition-all duration-1000" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <img src={item.imageUrl} className="w-12 h-12 rounded bg-muted object-cover" />
                          <div>
                            <p className="text-xs font-bold text-dao-jade">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-dao-paper/50 p-4 rounded-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-dao-jade uppercase tracking-widest mb-1">
                          <MapPin className="w-3 h-3 text-dao-gold" /> Shipping Address
                        </div>
                        {order.address ? (
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {order.address.fullName}<br />
                            {order.address.street}, {order.address.city}<br />
                            {order.address.zipCode}
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground italic">No address provided</p>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-dao-jade/5">
                        {order.status === 'delivered' ? (
                          <Button asChild variant="outline" size="sm" className="w-full text-[10px] uppercase font-bold">
                            <Link to={`/shop/${order.items[0].productId}`}>Share Reflection</Link>
                          </Button>
                        ) : (
                          <button className="text-[10px] font-bold text-dao-jade uppercase flex items-center gap-1 hover:text-dao-gold transition-colors">
                            View Fulfillment Details <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-dao-jade text-dao-paper p-8 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShoppingBag className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-display font-bold mb-4 text-dao-gold">Zen Journey</h3>
            <p className="text-sm text-dao-paper/70 leading-relaxed mb-6">
              You have acquired {orders?.length || 0} sacred items. Your path towards balance is clear.
            </p>
            <div className="h-2 w-full bg-dao-paper/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-dao-gold" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (orders?.length || 0) * 15)}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}