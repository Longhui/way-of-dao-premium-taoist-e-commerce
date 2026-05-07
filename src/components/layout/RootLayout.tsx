import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useUI } from '@/store/useUI';
import { useAuth } from '@/store/useAuth';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CartSheet } from '@/components/cart/CartSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // ZUSTAND PRIMITIVE SELECTORS
  const cartItems = useCart((s) => s.items);
  const openCart = useUI((s) => s.openCart);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Culture', href: '/culture' },
    { name: 'Shop', href: '/shop' },
  ];
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCart();
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen flex flex-col bg-dao-paper font-sans selection:bg-dao-jade selection:text-dao-paper">
      <nav className="sticky top-0 z-50 bg-dao-paper/80 backdrop-blur-md border-b border-dao-jade/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-display font-bold text-dao-jade tracking-tighter">
                WAY OF <span className="text-dao-gold">DAO</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-dao-gold",
                      location.pathname === link.href ? "text-dao-jade" : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="static" />
              {/* Profile/Auth */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-dao-jade hover:text-dao-gold transition-colors focus:outline-none">
                      <UserIcon className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border-dao-jade/10 shadow-soft">
                    <DropdownMenuLabel className="font-display text-dao-jade">
                      {user?.name}
                      <p className="text-[10px] text-muted-foreground font-sans truncate">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-dao-jade/5" />
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer text-dao-jade font-bold flex items-center">
                          <Settings className="w-4 h-4 mr-2" /> Archives (Admin)
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer text-dao-jade">My Collection</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-dao-jade/5" />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/admin-login" className="p-2 text-dao-jade hover:text-dao-gold transition-colors">
                  <UserIcon className="w-6 h-6" />
                </Link>
              )}
              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-dao-jade hover:text-dao-gold transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-dao-gold text-dao-paper text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                className="md:hidden p-2 text-dao-jade"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-dao-paper border-b border-dao-jade/10 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-dao-jade"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-bold text-dao-jade"
              >
                Archives (Admin)
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-dao-jade"
              >
                My Collection
              </Link>
            ) : (
              <Link
                to="/admin-login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-dao-jade"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-dao-jade text-dao-paper py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-dao-gold">Way of Dao</h3>
              <p className="text-dao-paper/70 max-w-xs text-sm leading-relaxed">
                Curating authentic Taoist artifacts and wisdom to bring balance and serenity to modern life.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-dao-gold">Navigation</h4>
              <ul className="space-y-2 text-sm text-dao-paper/70">
                <li><Link to="/" className="hover:text-dao-gold transition-colors">Home</Link></li>
                <li><Link to="/culture" className="hover:text-dao-gold transition-colors">Culture</Link></li>
                <li><Link to="/shop" className="hover:text-dao-gold transition-colors">Shop</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-dao-gold">Contact</h4>
              <p className="text-sm text-dao-paper/70">wisdom@wayofdao.com</p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-dao-paper/10 text-center text-xs text-dao-paper/50">
            &copy; {new Date().getFullYear()} Way of Dao. All rights reserved.
          </div>
        </div>
      </footer>
      <CartSheet />
    </div>
  );
}