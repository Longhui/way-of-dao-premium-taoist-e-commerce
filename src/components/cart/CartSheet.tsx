import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/store/useCart';
import { useUI } from '@/store/useUI';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
export function CartSheet() {
  const isOpen = useUI((s) => s.isCartOpen);
  const closeCart = useUI((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const navigate = useNavigate();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };
  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-dao-paper border-l-dao-jade/10 p-0">
        <SheetHeader className="p-6 border-b border-dao-jade/5">
          <SheetTitle className="text-2xl font-display font-bold text-dao-jade flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-dao-gold" /> Your Collection
          </SheetTitle>
          <SheetDescription className="sr-only">
            Manage your selected artifacts before finalizing your acquisition.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-dao-jade/5 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-dao-jade/20" />
              </div>
              <div>
                <p className="text-dao-jade font-display text-lg font-medium">The space is empty</p>
                <p className="text-muted-foreground text-sm mt-1">Discover artifacts that resonate with your path.</p>
              </div>
              <Button asChild variant="outline" onClick={closeCart} className="border-dao-jade/20 text-dao-jade hover:bg-dao-jade hover:text-dao-paper">
                <Link to="/shop">Explore Shop</Link>
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full p-6">
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-dao-jade leading-tight">{item.name}</h4>
                          <p className="text-xs text-dao-gold font-medium mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-dao-jade/10 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-dao-gold transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-dao-jade">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-dao-gold transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-dao-jade">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="p-6 bg-white border-t border-dao-jade/5 sm:flex-col space-y-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
                <span className="text-xl font-display font-bold text-dao-jade">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Shipping and taxes calculated at checkout.</p>
              <Button
                onClick={handleCheckout}
                className="w-full h-14 bg-dao-jade hover:bg-dao-jade/90 text-dao-paper font-bold uppercase tracking-widest text-xs"
              >
                Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}