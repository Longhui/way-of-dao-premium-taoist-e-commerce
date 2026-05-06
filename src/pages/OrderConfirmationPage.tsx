import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Leaf } from 'lucide-react';
export function OrderConfirmationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-24 h-24 rounded-full bg-dao-gold/10 flex items-center justify-center mb-12"
      >
        <CheckCircle className="w-12 h-12 text-dao-gold" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold text-dao-jade mb-8">
          The Path is <span className="text-dao-gold italic">Set</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-12 mx-auto">
          Your order has been received and is now being prepared with mindfulness. You will receive an email confirmation once your artifacts begin their journey to you.
        </p>
        <div className="p-8 bg-dao-jade/5 rounded-sm border border-dao-jade/10 max-w-md mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2 text-dao-jade font-bold text-sm uppercase tracking-widest">
            <Leaf className="w-4 h-4 text-dao-gold" /> Order Wisdom
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            "Nature does not hurry, yet everything is accomplished."
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-dao-jade text-dao-paper font-bold uppercase tracking-widest text-xs px-10 h-14">
            <Link to="/shop">Continue Exploring</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-dao-jade/20 text-dao-jade font-bold uppercase tracking-widest text-xs px-10 h-14">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}