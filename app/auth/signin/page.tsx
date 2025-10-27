'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Github, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'builder' | 'sponsor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sponsor signin form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGitHubSignIn = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=builder`,
        },
      });

      if (error) {
        toast.error('Failed to sign in with GitHub');
        console.error('Sign in error:', error);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSponsorSignIn = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast.error(error.message);
        console.error('Sponsor sign in error:', error);
      } else {
        toast.success('Signed in successfully!');
        // Redirect to sponsor dashboard
        router.push('/sponsor');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedRole === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="signin-role-selection">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground" data-testid="signin-welcome-heading">Welcome Back</h1>
            <p className="text-muted-foreground text-lg" data-testid="signin-description">
              Choose how you want to sign in to BuildAI Arena
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Builder Card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              onClick={handleGitHubSignIn}
              data-testid="role-builder-card"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/20 rounded-full">
                    <Github className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground">I'm a Builder</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in with GitHub to continue building
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="outline" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In with GitHub'}
                </Button>
              </CardContent>
            </Card>

            {/* Sponsor Card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-accent"
              onClick={() => setSelectedRole('sponsor')}
              data-testid="role-sponsor-card"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-accent rounded-full">
                    <Building2 className="h-8 w-8 text-accent-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground">I'm a Company/Sponsor</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in with your company credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="outline">
                  Sign In with Company Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:text-primary underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRole === 'builder') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4" data-testid="signin-builder-page">
        <Card className="max-w-md w-full p-8">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="signin-builder-heading">Welcome to BuildAI Arena</h1>
              <p className="text-muted-foreground mt-2" data-testid="signin-builder-description">
                Sign in to submit your AI projects and compete on the leaderboard
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleGitHubSignIn}
                disabled={isLoading}
                className="w-full"
                size="lg"
                data-testid="github-signin-btn"
              >
                <Github className="mr-2 h-5 w-5" />
                {isLoading ? 'Signing in...' : 'Sign in with GitHub'}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>

            <Button
              variant="ghost"
              onClick={() => setSelectedRole(null)}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to role selection
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (selectedRole === 'sponsor') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4" data-testid="signin-sponsor-page">
        <Card className="max-w-md w-full p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="signin-sponsor-heading">Sponsor Sign In</h1>
              <p className="text-muted-foreground mt-2" data-testid="signin-sponsor-description">
                Sign in with your company credentials
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="company@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="sponsor-email-input"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="sponsor-password-input"
                />
              </div>
            </div>

            <Button
              onClick={handleSponsorSignIn}
              disabled={isLoading}
              className="w-full"
              size="lg"
              data-testid="sponsor-signin-btn"
            >
              <Building2 className="mr-2 h-5 w-5" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>

            <Button
              variant="ghost"
              onClick={() => setSelectedRole(null)}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to role selection
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}