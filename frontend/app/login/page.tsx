"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../../context/AuthContext';

export default function Auth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const isLogin = event.currentTarget.id === 'login-form';

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const data = await response.json();

      toast({
        title: isLogin ? 'Login Successful' : 'Signup Successful',
        description: data.message,
      });

      if (isLogin) {
        login(data.token);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('An error occurred:', error);
      toast({
        title: 'Authentication Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Login or create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                <Input type="text" name="username" placeholder="Username" required />
                <Input type="password" name="password" placeholder="Password" required />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form id="signup-form" onSubmit={handleSubmit} className="space-y-4">
                <Input type="text" name="username" placeholder="Username" required />
                <Input type="password" name="password" placeholder="Password" required />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
