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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border-dao-jade/10 shadow-premium overflow-hidden">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-display font-bold text-dao-jade">
              {isRegister ? "Begin the Journey" : "Enter the Sanctuary"}
            </CardTitle>
            <CardDescription className="text-muted-foreground italic">
              {isRegister ? "Create your profile to track your path." : "Realign with your collection."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Laozi" value={name} onChange={(e) => setName(e.target.value)} className="bg-dao-paper/50" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="text" placeholder="traveler@dao.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-dao-paper/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-dao-paper/50" required />
              </div>
              <AnimatePresence mode="popLayout">
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-dao-paper/50" required />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button type="submit" disabled={isLoading} className="w-full h-12 bg-dao-jade hover:bg-dao-jade/90 text-dao-paper font-bold uppercase tracking-widest text-xs mt-4">
                {isLoading ? "Aligning..." : isRegister ? "Register" : "Sign In"}
              </Button>
            </form>
            <div className="mt-8 pt-6 border-t border-dao-jade/5 text-center space-y-4">
              <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-dao-jade hover:text-dao-gold transition-colors font-medium">
                {isRegister ? "Already have a profile? Sign In" : "New traveler? Register here"}
              </button>
              {!isRegister && (
                <div className="text-[10px] text-muted-foreground">
                  Admin? Log in with <span className="font-bold text-dao-gold">admin / 1234</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}