import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, ChevronLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
export function CheckoutPage() {
  const [step, setStep] = React.useState(1);
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const navigate = useNavigate();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15.00;
  const total = subtotal + shipping;
  const handleCompleteOrder = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Aligning with the flow...',
      success: () => {
        clearCart();
        navigate('/confirmation');
        return 'Order harmonized successfully.';
      },
      error: 'The path was blocked. Please try again.',
    });
  };
  if (items.length === 0 && step !== 4) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-display font-bold text-dao-jade mb-6">Your cart is empty</h2>
        <Button onClick={() => navigate('/shop')} className="bg-dao-jade text-dao-paper">Return to Shop</Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          {/* Progress */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <span className={step >= 1 ? "text-dao-jade" : "text-muted-foreground"}>Shipping</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className={step >= 2 ? "text-dao-jade" : "text-muted-foreground"}>Payment</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className={step >= 3 ? "text-dao-jade" : "text-muted-foreground"}>Review</span>
          </div>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-display font-bold text-dao-jade">Shipping Sanctuary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Laozi" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="wisdom@tao.com" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Serenity Lane" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mount Wudang" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input id="zip" placeholder="10001" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                  </div>
                </div>
                <Button onClick={() => setStep(2)} className="w-full md:w-auto px-12 h-14 bg-dao-jade text-dao-paper font-bold uppercase tracking-widest text-xs">
                  Continue to Payment
                </Button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-display font-bold text-dao-jade">Secure Exchange</h2>
                <div className="p-6 bg-dao-jade/5 rounded-sm border border-dao-jade/10 flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-dao-gold" />
                  <span className="text-sm font-medium text-dao-jade">Mock Payment Mode Enabled</span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="card">Card Number</Label>
                    <Input id="card" placeholder="0000 0000 0000 0000" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="exp">Expiry</Label>
                      <Input id="exp" placeholder="MM/YY" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="bg-white border-dao-jade/10 focus:border-dao-gold" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-dao-jade">
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 md:flex-none md:px-12 h-14 bg-dao-jade text-dao-paper font-bold uppercase tracking-widest text-xs">
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-display font-bold text-dao-jade">Final Reflection</h2>
                <div className="bg-white p-8 rounded-sm border border-dao-jade/5 space-y-6">
                  <div className="flex items-center gap-3 text-dao-jade">
                    <ShieldCheck className="w-5 h-5 text-dao-gold" />
                    <span className="text-sm font-bold uppercase tracking-widest">Authentication Verified</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    By clicking 'Complete Order', you are confirming your selection of these authentic artifacts. Your path will be updated once the transaction is harmonized.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setStep(2)} className="text-dao-jade">
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button onClick={handleCompleteOrder} className="flex-1 md:flex-none md:px-12 h-14 bg-dao-gold text-dao-jade font-bold uppercase tracking-widest text-xs">
                    Complete Order
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-white rounded-sm border border-dao-jade/5 p-8 space-y-8">
            <h3 className="text-lg font-display font-bold text-dao-jade">Order Summary</h3>
            <div className="space-y-4 max-h-60 overflow-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-dao-jade">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-dao-jade">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="bg-dao-jade/5" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator className="my-4 bg-dao-jade/5" />
              <div className="flex justify-between text-lg font-display font-bold text-dao-jade">
                <span>Total</span>
                <span className="text-dao-gold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}