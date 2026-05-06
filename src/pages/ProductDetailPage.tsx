import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Minus, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { MOCK_PRODUCTS } from '@shared/mock-data';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export function ProductDetailPage() {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const addItem = useCart((s) => s.addItem);
  const [quantity, setQuantity] = React.useState(1);
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-dao-jade mb-4">Product Not Found</h2>
          <Button asChild variant="outline">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }
  const handleAddToCart = () => {
    // Basic implementation for Phase 1
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success('Added to your collection', {
      description: `${quantity}x ${product.name} added to cart.`
    });
  };
  return (
    <div className="bg-dao-paper py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-dao-gold transition-colors mb-12">
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square bg-muted rounded-sm overflow-hidden shadow-premium"
          >
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <Badge className="w-fit bg-dao-gold/10 text-dao-gold border-none mb-6 font-bold uppercase tracking-widest text-[10px]">
              {product.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-dao-jade mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-dao-gold font-medium mb-8">
              ${product.price.toFixed(2)}
            </p>
            <div className="prose prose-sm text-muted-foreground leading-relaxed mb-10 max-w-none">
              {product.description}
            </div>
            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-widest text-dao-jade">Quantity</span>
                <div className="flex items-center border border-dao-jade/10 rounded-full px-4 py-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:text-dao-gold">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-dao-jade">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="p-1 hover:text-dao-gold">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="w-full h-16 bg-dao-jade hover:bg-dao-jade/90 text-dao-paper font-bold text-sm uppercase tracking-[0.2em]">
                <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-8 border-t border-dao-jade/10 pt-8">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-dao-gold" />
                <div>
                  <h4 className="text-xs font-bold text-dao-jade uppercase mb-1">Authenticity Guaranteed</h4>
                  <p className="text-[11px] text-muted-foreground">Certified traditional sources.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-dao-gold" />
                <div>
                  <h4 className="text-xs font-bold text-dao-jade uppercase mb-1">Mindful Shipping</h4>
                  <p className="text-[11px] text-muted-foreground">Sustainably packaged with care.</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-dao-jade mb-4">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm py-2 border-b border-dao-jade/5">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="text-dao-jade font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}