import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_PRODUCTS } from '@shared/mock-data';
export function HomePage() {
  const featured = MOCK_PRODUCTS.slice(0, 4);
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-dao-jade">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2000&auto=format&fit=crop" 
            alt="Taoist Landscape" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 text-dao-gold font-medium tracking-widest uppercase text-xs mb-6">
              <Sparkles className="w-4 h-4" /> Discover the Middle Way
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-dao-paper mb-8 leading-[1.1]">
              Harmony for the <span className="text-dao-gold italic">Modern Soul</span>
            </h1>
            <p className="text-xl text-dao-paper/80 mb-10 leading-relaxed font-light">
              Authentic artifacts and ancient wisdom curated to help you navigate the flow of life with grace and balance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-dao-gold hover:bg-dao-gold/90 text-dao-jade font-bold px-8 h-14">
                <Link to="/shop">Explore Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-dao-paper/30 text-dao-paper hover:bg-dao-paper/10 px-8 h-14">
                <Link to="/culture">Our Philosophy</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-24 md:py-32 bg-dao-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dao-jade mb-4">Featured Artifacts</h2>
              <p className="text-muted-foreground">Handpicked selections for your daily practice.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-dao-jade font-bold hover:text-dao-gold transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/shop/${product.id}`}>
                  <div className="aspect-[4/5] overflow-hidden bg-muted mb-6 relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-dao-jade/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-dao-jade mb-1 group-hover:text-dao-gold transition-colors">{product.name}</h3>
                  <p className="text-dao-gold font-medium">${product.price.toFixed(2)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Culture Teaser */}
      <section className="py-24 bg-dao-jade text-dao-paper relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                Rooted in <span className="text-dao-gold">Millennia of Wisdom</span>
              </h2>
              <p className="text-dao-paper/70 text-lg mb-8 leading-relaxed italic">
                "The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name."
              </p>
              <p className="text-dao-paper/80 mb-10 leading-relaxed">
                Explore our collection of insights into Taoist philosophy, from the teachings of Laozi to the practical application of Feng Shui in modern spaces.
              </p>
              <Button asChild variant="outline" className="border-dao-gold text-dao-gold hover:bg-dao-gold hover:text-dao-jade">
                <Link to="/culture">Enter the Library</Link>
              </Button>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="aspect-square rounded-full border border-dao-gold/30 p-8 flex items-center justify-center animate-spin-slow">
                 <div className="w-full h-full rounded-full border border-dao-gold/50 flex items-center justify-center p-8">
                    <img 
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" 
                      alt="Ancient Texts" 
                      className="w-full h-full object-cover rounded-full shadow-2xl"
                    />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}