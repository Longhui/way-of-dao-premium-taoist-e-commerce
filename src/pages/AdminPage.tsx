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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-display font-bold text-dao-jade">Celestial <span className="text-dao-gold italic">Archives</span></h1>
          <p className="text-muted-foreground mt-1">Manage the flow of artifacts in the physical realm.</p>
        </motion.div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-dao-jade hover:bg-dao-jade/90 text-dao-paper uppercase tracking-widest text-xs font-bold h-12 px-6 transition-all duration-300 hover:scale-[1.02]">
              <Plus className="w-4 h-4 mr-2" /> Unveil New Artifact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-dao-paper border-dao-jade/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-dao-jade">
                {editingProduct ? 'Harmonize Artifact' : 'Manifest Artifact'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Describe the essence and properties of the artifact to be added to the collection.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Artifact Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required className="bg-white border-dao-jade/10 focus:ring-dao-gold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" name="category" defaultValue={editingProduct?.category} className="h-10 px-3 rounded-md bg-white border border-dao-jade/10 text-sm focus:outline-none focus:ring-2 focus:ring-dao-gold">
                    <option value="Incense">Incense</option>
                    <option value="Literature">Literature</option>
                    <option value="Artifacts">Artifacts</option>
                    <option value="Attire">Attire</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="bg-white border-dao-jade/10 focus:ring-dao-gold" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Imagery URL</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={editingProduct?.imageUrl} required className="bg-white border-dao-jade/10 focus:ring-dao-gold" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Essence (Description)</Label>
                <textarea id="description" name="description" defaultValue={editingProduct?.description} className="min-h-[100px] p-3 rounded-md bg-white border border-dao-jade/10 text-sm focus:outline-none focus:ring-2 focus:ring-dao-gold" required />
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" className="w-full bg-dao-jade text-dao-paper uppercase tracking-widest text-xs font-bold h-12 hover:bg-dao-jade/90">
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
              placeholder="Search by name or category..."
              className="pl-10 bg-dao-paper/50 border-dao-jade/10 focus:border-dao-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-dao-paper/50">
            <TableRow className="border-dao-jade/5">
              <TableHead className="text-dao-jade uppercase tracking-widest text-[10px] font-bold py-4">Artifact</TableHead>
              <TableHead className="text-dao-jade uppercase tracking-widest text-[10px] font-bold py-4">Category</TableHead>
              <TableHead className="text-dao-jade uppercase tracking-widest text-[10px] font-bold py-4">Price</TableHead>
              <TableHead className="text-dao-jade text-right uppercase tracking-widest text-[10px] font-bold py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={4} className="h-20 bg-dao-jade/5" />
                </TableRow>
              ))
            ) : filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No artifacts match your search.</TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((product) => (
                <TableRow key={product.id} className="border-dao-jade/5 hover:bg-dao-paper/30 transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm bg-muted overflow-hidden flex-shrink-0 border border-dao-jade/5">
                        <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-bold text-dao-jade text-sm">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-[10px] px-3 py-1 bg-dao-gold/10 text-dao-gold rounded-full font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-dao-jade font-medium">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="hover:text-dao-gold h-8 w-8" onClick={() => {
                        setEditingProduct(product);
                        setIsDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-destructive h-8 w-8" onClick={() => {
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