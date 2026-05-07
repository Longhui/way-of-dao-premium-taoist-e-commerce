import React from 'react';
import { motion } from 'framer-motion';
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
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const from = (location.state as any)?.from?.pathname || "/shop";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setIsLoading(true);
    try {
      const userData = await api<User>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, name }),
      });
      const session: UserSession = {
        id: userData.id,
        name: userData.name,
        email: userData.email || '',
        isAuthenticated: true,
        role: userData.role || 'user',
      };
      login(session);
      toast.success(`Welcome back, ${userData.name}`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
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
        <Card className="bg-white border-dao-jade/10 shadow-premium">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-display font-bold text-dao-jade">Begin Your Journey</CardTitle>
            <CardDescription className="text-muted-foreground italic">
              Enter your details to sync your collection across the path.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="traveler@dao.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-dao-paper/50 border-dao-jade/10 focus:border-dao-gold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Laozi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-dao-paper/50 border-dao-jade/10 focus:border-dao-gold"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-dao-jade hover:bg-dao-jade/90 text-dao-paper font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? "Aligning..." : "Enter the Sanctuary"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}