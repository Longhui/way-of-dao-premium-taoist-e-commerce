import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Minus, ShoppingCart, ShieldCheck, Truck, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Product, Review } from '@shared/types';
import { useCart } from '@/store/useCart';
import { useAuth } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
export function ProductDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const addItem = useCart((s) => s.addItem);
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const [quantity, setQuantity] = React.useState(1);
  const [rating, setRating] = React.useState(5);
  const [reviewText, setReviewText] = React.useState('');
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api<Product>(`/api/products/${id}`),
    enabled: !!id,
  });
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api<Product[]>('/api/products'),
  });
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => api<Review[]>(`/api/reviews/${id}`),
    enabled: !!id,
  });
  const reviewMutation = useMutation({
    mutationFn: (newReview: Partial<Review>) => api('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(newReview),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      setReviewText('');
      toast.success('Reflection shared');
    }
  });
  const recommended = products?.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4) || [];
  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <Skeleton className="h-[500px] w-full bg-dao-jade/5" />
      </div>
    );
  }
  if (!product) return <div className="text-center py-20">Artifact not found</div>;
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success('Added to collection');
  };
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return toast.error('Login to share reflection');
    reviewMutation.mutate({
      productId: id,
      userId: user.id,
      userName: user.name,
      rating,
      text: reviewText
    });
  };
  return (
    <div className="bg-dao-paper py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-dao-gold mb-12">
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square bg-muted overflow-hidden shadow-premium">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col">
            <Badge className="w-fit mb-6 bg-dao-gold/10 text-dao-gold">{product.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-dao-jade mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <p className="text-2xl text-dao-gold font-medium">${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-10">{product.description}</p>
            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-widest">Quantity</span>
                <div className="flex items-center border border-dao-jade/10 rounded-full px-4 py-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1"><Minus className="w-4 h-4" /></button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="p-1"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="w-full h-16 bg-dao-jade text-dao-paper uppercase tracking-widest font-bold">
                <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
        {/* Reviews */}
        <section className="mb-32">
          <h2 className="text-3xl font-display font-bold text-dao-jade mb-12">User Reflections</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              {reviewsLoading ? <Skeleton className="h-40 w-full" /> : reviews?.length === 0 ? (
                <p className="text-muted-foreground italic">No reflections have been shared for this artifact yet.</p>
              ) : reviews?.map(review => (
                <div key={review.id} className="p-6 bg-white border border-dao-jade/5 rounded-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-dao-jade">{review.userName}</span>
                    <div className="flex text-dao-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-dao-jade/10'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-dao-jade/5 p-8 rounded-sm">
                <h3 className="font-bold text-dao-jade mb-6">Leave a Reflection</h3>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-6 h-6 cursor-pointer ${s <= rating ? 'text-dao-gold fill-current' : 'text-dao-jade/20'}`} onClick={() => setRating(s)} />
                      ))}
                    </div>
                    <Textarea placeholder="Share your experience with this artifact..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} required className="bg-white border-dao-jade/10" />
                    <Button type="submit" className="w-full bg-dao-jade text-dao-paper uppercase tracking-widest text-xs font-bold" disabled={reviewMutation.isPending}>
                      Submit Reflection
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground">Please <Link to="/auth" className="text-dao-gold font-bold underline">login</Link> to share your reflection.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Recommended */}
        {recommended.length > 0 && (
          <section>
            <h2 className="text-3xl font-display font-bold text-dao-jade mb-12">Recommended Artifacts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {recommended.map(item => (
                <Link key={item.id} to={`/shop/${item.id}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden bg-muted mb-4">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <h4 className="font-bold text-dao-jade group-hover:text-dao-gold transition-colors">{item.name}</h4>
                  <p className="text-sm text-dao-gold">${item.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}