import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner';
export function AdminPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api<Product[]>('/api/products'),
  });
  const createMutation = useMutation({
    mutationFn: (newProd: Product) => api('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(newProd),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Artifact added to the path');
      setIsDialogOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: (prod: Product) => api(`/api/admin/products/${prod.id}`, {
      method: 'PUT',
      body: JSON.stringify(prod),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Artifact harmonized');
      setIsDialogOpen(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/admin/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Artifact returned to void');
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as any,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string,
      description: formData.get('description') as string,
      specifications: editingProduct?.specifications || {},
    } as Product;
    if (editingProduct) {
      updateMutation.mutate({ ...editingProduct, ...data });
    } else {
      createMutation.mutate(data);
    }
  };
  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-dao-jade">Celestial <span className="text-dao-gold italic">Archives</span></h1>
          <p className="text-muted-foreground">Manage the flow of artifacts in the physical realm.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-dao-jade hover:bg-dao-jade/90 text-dao-paper uppercase tracking-widest text-xs font-bold h-12 px-6">
              <Plus className="w-4 h-4 mr-2" /> Unveil New Artifact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-dao-paper border-dao-jade/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-dao-jade">
                {editingProduct ? 'Harmonize Artifact' : 'Manifest Artifact'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form to add or edit product details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Artifact Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required className="bg-white border-dao-jade/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" name="category" defaultValue={editingProduct?.category} className="h-10 px-3 rounded-md bg-white border border-dao-jade/10 text-sm">
                    <option value="Incense">Incense</option>
                    <option value="Literature">Literature</option>
                    <option value="Artifacts">Artifacts</option>
                    <option value="Attire">Attire</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="bg-white border-dao-jade/10" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Imagery URL</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={editingProduct?.imageUrl} required className="bg-white border-dao-jade/10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Essence (Description)</Label>
                <textarea id="description" name="description" defaultValue={editingProduct?.description} className="min-h-[100px] p-3 rounded-md bg-white border border-dao-jade/10 text-sm" required />
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" className="w-full bg-dao-jade text-dao-paper uppercase tracking-widest text-xs font-bold h-12">
                  {editingProduct ? 'Update Presence' : 'Commit to Path'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <div className="bg-white border border-dao-jade/5 rounded-sm overflow-hidden shadow-soft">
        <div className="p-6 border-b border-dao-jade/5 flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or essence..." 
              className="pl-10 bg-dao-paper/50 border-dao-jade/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-dao-paper/50">
            <TableRow className="border-dao-jade/5">
              <TableHead className="text-dao-jade uppercase tracking-widest text-[10px] font-bold">Artifact</TableHead>
              <TableHead className="text-dao-jade uppercase tracking-widest text-[10px] font-bold">Category</TableHead>
              <TableHead className="text-dao-jade uppercase tracking-widest text-[10px] font-bold">Price</TableHead>
              <TableHead className="text-dao-jade text-right uppercase tracking-widest text-[10px] font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={4} className="h-16 bg-dao-jade/5" />
                </TableRow>
              ))
            ) : filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No artifacts match your search.</TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((product) => (
                <TableRow key={product.id} className="border-dao-jade/5 hover:bg-dao-paper/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-muted overflow-hidden flex-shrink-0">
                        <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-bold text-dao-jade text-sm">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-1 bg-dao-gold/10 text-dao-gold rounded-full font-bold">{product.category}</span>
                  </TableCell>
                  <TableCell className="text-dao-jade font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="hover:text-dao-gold" onClick={() => {
                        setEditingProduct(product);
                        setIsDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => {
                        if (confirm('Are you sure you want to return this artifact to the void?')) {
                          deleteMutation.mutate(product.id);
                        }
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}