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

export default function SignUpPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'builder' | 'sponsor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sponsor signup form fields
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGitHubSignUp = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=builder`,
        },
      });

      if (error) {
        toast.error('Failed to sign up with GitHub');
        console.error('GitHub sign up error:', error);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSponsorSignUp = async () => {
    if (!companyName || !companyEmail || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: companyEmail,
        password: password,
        options: {
          data: {
            role: 'sponsor',
            company_name: companyName,
            company_website: companyWebsite || null,
          }
        }
      });

      if (authError) {
        toast.error(authError.message);
        console.error('Sponsor sign up error:', authError);
        return;
      }

      if (authData.user) {
        // Create user profile via API route (uses service role key to bypass RLS)
        const response = await fetch('/api/sponsor-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            companyName,
            companyWebsite,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Profile creation error:', errorData);
          toast.error('Account created but profile setup failed. Please contact support.');
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
          router.push('/onboarding'); // Redirect to onboarding to complete profile
        }
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
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Join BuildAI Arena</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Choose how you want to participate in the AI building community
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Builder Card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
              onClick={() => setSelectedRole('builder')}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-950 rounded-full">
                    <Github className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">I'm a Builder</CardTitle>
                <CardDescription>
                  I want to build AI projects and compete on challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>• Submit AI projects to challenges</p>
                  <p>• Get evaluated by LLMs and sponsors</p>
                  <p>• Compete on leaderboards</p>
                  <p>• Showcase your skills to companies</p>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Sign Up with GitHub
                </Button>
              </CardContent>
            </Card>

            {/* Sponsor Card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-500"
              onClick={() => setSelectedRole('sponsor')}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-purple-100 dark:bg-purple-950 rounded-full">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">I'm a Company/Sponsor</CardTitle>
                <CardDescription>
                  I want to post challenges and discover AI talent
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>• Post AI product challenges</p>
                  <p>• Review and evaluate submissions</p>
                  <p>• Discover talented AI builders</p>
                  <p>• Hire top performers</p>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Sign Up with Company Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRole === 'builder') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Join as a Builder</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Sign up with GitHub to start building AI projects and competing
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleGitHubSignUp}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <Github className="mr-2 h-5 w-5" />
                {isLoading ? 'Signing up...' : 'Sign up with GitHub'}
              </Button>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
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
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">Join as a Sponsor</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Create your company account to start posting challenges
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Your Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  placeholder="company@example.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              onClick={handleSponsorSignUp}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Building2 className="mr-2 h-5 w-5" />
              {isLoading ? 'Creating Account...' : 'Create Company Account'}
            </Button>

            <div className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
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
