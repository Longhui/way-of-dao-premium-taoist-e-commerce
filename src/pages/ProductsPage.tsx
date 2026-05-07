import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Product } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
export function ProductsPage() {
  const categories = ['All', 'Incense', 'Literature', 'Artifacts', 'Attire'];
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api<Product[]>('/api/products'),
  });
  const filteredProducts = (products ?? [])
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="bg-dao-paper min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-dao-jade mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Categories
              </h3>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "text-sm font-medium transition-all hover:pl-2 hover:text-dao-gold",
                        activeCategory === cat ? "text-dao-jade font-bold border-l-2 border-dao-gold pl-4" : "text-muted-foreground pl-0"
                      )}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:block">
              <h3 className="text-xs font-bold uppercase tracking-widest text-dao-jade mb-6">Discovery</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-transparent border-dao-jade/10 focus:border-dao-gold"
                />
              </div>
            </div>
          </aside>
          {/* Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-sm font-bold text-muted-foreground">
                Showing {filteredProducts.length} results
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-sm bg-dao-jade/5" />
                    <Skeleton className="h-6 w-3/4 bg-dao-jade/5" />
                    <Skeleton className="h-4 w-1/4 bg-dao-jade/5" />
                  </div>
                ))
              ) : (
                filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link to={`/shop/${product.id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-muted mb-6 relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-dao-paper/90 text-dao-jade border-none text-[10px] uppercase font-bold tracking-tighter">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-dao-jade mb-1 group-hover:text-dao-gold transition-colors">{product.name}</h3>
                      <p className="text-dao-gold font-medium mb-4">${product.price.toFixed(2)}</p>
                      <button className="w-full py-3 bg-dao-jade text-dao-paper text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        View Detail
                      </button>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}