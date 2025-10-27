'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Building2, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Sponsor-specific form fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');

  useEffect(() => {
    // Check if user is already authenticated and has a role
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role, company_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.role === 'sponsor' && profile?.company_name) {
          // Sponsor with company info, redirect to dashboard
          router.push('/sponsor');
        } else if (profile?.role === 'builder') {
          // Builder, redirect to challenges
          router.push('/challenges');
        }
        // If no role or sponsor without company info, stay on onboarding
      } else {
        // Not authenticated, redirect to signup
        router.push('/auth/signup');
      }
    };

    checkUserRole();
  }, [router]);

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      toast.error('Company name is required');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be signed in to complete onboarding');
        return;
      }

      // Update user profile with company information
      const { error } = await supabase
        .from('users')
        .update({
          company_name: companyName.trim(),
          company_website: companyWebsite.trim() || null,
          company_logo_url: companyLogo.trim() || null,
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
        console.error('Profile update error:', error);
        return;
      }

      toast.success('Company profile updated successfully!');
      router.push('/sponsor');
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center space-y-6">
          <div>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-accent rounded-full">
                <Building2 className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Complete Your Company Profile</h1>
            <p className="text-muted-foreground mt-2">
              Add your company information to start posting challenges
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
              <Label htmlFor="companyLogo">Company Logo URL</Label>
              <Input
                id="companyLogo"
                type="url"
                placeholder="https://yourcompany.com/logo.png"
                value={companyLogo}
                onChange={(e) => setCompanyLogo(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {isLoading ? 'Updating Profile...' : 'Complete Setup'}
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>This information will be displayed on your challenges and company profile</p>
          </div>
        </div>
      </Card>
    </div>
  );
}