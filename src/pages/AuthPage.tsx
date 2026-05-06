import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { UserSession, User } from '@shared/types';
import { toast } from 'sonner';
export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((s) => s.login);
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const from = (location.state as any)?.from?.pathname || "/shop";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Credentials required");
    if (isRegister && password !== confirmPassword) return toast.error("Passwords do not match");
    setIsLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const userData = await api<User>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, name, password }),
      });
      const session: UserSession = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAuthenticated: true,
        role: userData.role || 'user',
      };
      login(session);
      toast.success(isRegister ? "Soul Registered" : `Welcome back, ${userData.name}`);
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || "The path is blocked. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 flex items-center justify-center bg-dao-paper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border-dao-jade/10 shadow-premium overflow-hidden">
          <CardHeader className="text-center space-y-2 pb-8 pt-10">
            <CardTitle className="text-3xl font-display font-bold text-dao-jade">
              {isRegister ? "Begin the Journey" : "Enter the Sanctuary"}
            </CardTitle>
            <CardDescription className="text-dao-jade/60 italic font-medium">
              {isRegister ? "Create your profile to track your path." : "Realign with your collection."}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-dao-jade font-bold text-xs uppercase tracking-widest">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Master Zhou" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="bg-white border-dao-jade/20 text-dao-jade placeholder:text-muted-foreground/80 focus:ring-dao-jade" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-dao-jade font-bold text-xs uppercase tracking-widest">Email Path</Label>
                <Input 
                  id="email" 
                  type="text" 
                  placeholder="traveler@dao.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bg-white border-dao-jade/20 text-dao-jade placeholder:text-muted-foreground/80 focus:ring-dao-jade" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-dao-jade font-bold text-xs uppercase tracking-widest">Gate Key (Password)</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-white border-dao-jade/20 text-dao-jade placeholder:text-muted-foreground/80 focus:ring-dao-jade" 
                  required 
                />
              </div>
              <AnimatePresence mode="popLayout">
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirm" className="text-dao-jade font-bold text-xs uppercase tracking-widest">Confirm Gate Key</Label>
                    <Input 
                      id="confirm" 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="bg-white border-dao-jade/20 text-dao-jade placeholder:text-muted-foreground/80 focus:ring-dao-jade" 
                      required 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button type="submit" disabled={isLoading} className="w-full h-14 bg-dao-jade hover:bg-dao-jade/90 text-dao-paper font-bold uppercase tracking-[0.2em] text-xs mt-6 transition-all shadow-md active:scale-95">
                {isLoading ? "Aligning..." : isRegister ? "Begin Journey" : "Enter Sanctuary"}
              </Button>
            </form>
            <div className="mt-10 pt-8 border-t border-dao-jade/5 text-center space-y-4">
              <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-dao-jade hover:text-dao-gold transition-colors font-bold underline decoration-dao-jade/10 underline-offset-4">
                {isRegister ? "Return to Sign In" : "New traveler? Register here"}
              </button>
              {!isRegister && (
                <div className="p-4 bg-dao-jade/5 rounded-md border border-dao-jade/10">
                  <p className="text-[10px] text-dao-jade/70 font-bold uppercase tracking-widest mb-1">Celestial Access</p>
                  <p className="text-[11px] text-dao-jade leading-relaxed">
                    Admin? Use <span className="font-bold text-dao-gold px-1">admin / 1234</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}