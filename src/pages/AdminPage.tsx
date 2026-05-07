import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Product, Order, OrderStatus } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Package, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
export function AdminPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => api<Product[]>('/api/products') });
  const { data: orders } = useQuery({ queryKey: ['admin-orders'], queryFn: () => api<Order[]>('/api/admin/orders') });
  const productMutation = useMutation({
    mutationFn: (prod: Product) => api(editingProduct ? `/api/admin/products/${prod.id}` : '/api/admin/products', {
      method: editingProduct ? 'PUT' : 'POST',
      body: JSON.stringify(prod),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDialogOpen(false);
      toast.success('Artifact Harmonized');
    }
  });
  const orderStatusMutation = useMutation({
    mutationFn: ({ id, update }: { id: string, update: Partial<Order> }) => api(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    }
  });
  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      category: fd.get('category') as any,
      price: parseFloat(fd.get('price') as string),
      imageUrl: fd.get('imageUrl') as string,
      description: fd.get('description') as string,
      specifications: {},
      id: editingProduct?.id
    } as Product;
    productMutation.mutate(data);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold text-dao-jade">Celestial <span className="text-dao-gold italic">Archives</span></h1>
        <p className="text-muted-foreground mt-1">Administrative management for products and soul journeys.</p>
      </header>
      <Tabs defaultValue="products" className="space-y-8">
        <TabsList className="bg-dao-jade/5 p-1">
          <TabsTrigger value="products" className="data-[state=active]:bg-dao-jade data-[state=active]:text-dao-paper uppercase tracking-widest text-[10px] font-bold">Artifacts</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-dao-jade data-[state=active]:text-dao-paper uppercase tracking-widest text-[10px] font-bold">Order Flow</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="bg-white border border-dao-jade/5 rounded-sm overflow-hidden shadow-soft">
            <div className="p-6 border-b border-dao-jade/5 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search artifacts..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingProduct(null)} className="bg-dao-jade text-dao-paper uppercase tracking-widest text-xs font-bold h-10">
                    <Plus className="w-4 h-4 mr-2" /> Manifest Artifact
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dao-paper sm:max-w-[500px]">
                  <DialogHeader><DialogTitle className="text-dao-jade font-display text-xl">Artifact Details</DialogTitle></DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2"><Label className="text-dao-jade">Name</Label><Input name="name" defaultValue={editingProduct?.name} required className="bg-white" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2"><Label className="text-dao-jade">Category</Label><select name="category" defaultValue={editingProduct?.category} className="h-10 px-3 rounded-md bg-white border border-dao-jade/10 text-sm"><option value="Artifacts">Artifacts</option><option value="Incense">Incense</option><option value="Literature">Literature</option><option value="Attire">Attire</option></select></div>
                      <div className="grid gap-2"><Label className="text-dao-jade">Price</Label><Input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="bg-white" /></div>
                    </div>
                    <div className="grid gap-2"><Label className="text-dao-jade">Image URL</Label><Input name="imageUrl" defaultValue={editingProduct?.imageUrl} required className="bg-white" /></div>
                    <div className="grid gap-2"><Label className="text-dao-jade">Description</Label><textarea name="description" defaultValue={editingProduct?.description} className="min-h-[100px] p-3 rounded-md border border-dao-jade/10 text-sm bg-white" required /></div>
                    <Button type="submit" className="w-full bg-dao-jade text-dao-paper font-bold uppercase tracking-widest text-xs h-12" disabled={productMutation.isPending}>Commit to Path</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow className="bg-dao-paper/50"><TableHead>Artifact</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                  <TableRow key={product.id} className="hover:bg-dao-paper/30 group">
                    <TableCell className="font-bold flex items-center gap-4 text-dao-jade"><img src={product.imageUrl} className="w-10 h-10 object-cover" /> {product.name}</TableCell>
                    <TableCell><Badge variant="outline" className="border-dao-jade/20 text-dao-jade">{product.category}</Badge></TableCell>
                    <TableCell className="text-dao-jade font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}><Edit className="w-4 h-4 text-dao-jade" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <div className="bg-white border border-dao-jade/5 rounded-sm shadow-soft overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-dao-paper/50"><TableHead>Order ID</TableHead><TableHead>Status</TableHead><TableHead>Total</TableHead><TableHead className="text-right">Update Path</TableHead></TableRow></TableHeader>
              <TableBody>
                {orders?.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs text-dao-jade/80">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell><Badge className="bg-dao-gold/20 text-dao-jade border-none">{order.status}</Badge></TableCell>
                    <TableCell className="text-dao-jade font-bold">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select onValueChange={(val: OrderStatus) => orderStatusMutation.mutate({ id: order.id, update: { status: val } })}>
                          <SelectTrigger className="w-[130px] h-8 text-[10px] uppercase font-bold text-dao-jade">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        {order.status === 'processing' && (
                          <Button size="sm" variant="ghost" className="h-8 text-dao-gold" onClick={() => orderStatusMutation.mutate({ id: order.id, update: { trackingNumber: `DAO-${Math.floor(Math.random()*100000)}` } })}>
                            <Truck className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}