'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';
import { Building2, Globe, Mail, ExternalLink, Save } from 'lucide-react';

export default function SponsorProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading, isAuthenticated, signOut, isSponsor } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyIntro, setCompanyIntro] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isSponsor) {
      router.push('/profile');
    }
  }, [isLoading, isAuthenticated, isSponsor, router]);

  useEffect(() => {
    if (profile && isSponsor) {
      setCompanyName(profile.company_name || '');
      setCompanyWebsite(profile.company_website || '');
      setCompanyLogo(profile.company_logo_url || '');
      setCompanyIntro((profile as any).company_intro || '');
    }
  }, [profile, isSponsor]);

  useEffect(() => {
    if (profile && user) {
      setCompanyEmail(user.email || '');
    }
  }, [profile, user]);

  const handleUpdateProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          company_name: companyName || null,
          company_website: companyWebsite || null,
          company_logo_url: companyLogo || null,
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Company profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!profile || !isSponsor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and branding
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logo Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Company Logo URL
              </label>
              <Input
                value={companyLogo}
                onChange={(e) => setCompanyLogo(e.target.value)}
                placeholder="https://yourcompany.com/logo.png"
                type="url"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add a link to your company logo image
              </p>
              <div className="mt-3">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt="Company Logo"
                    width={120}
                    height={120}
                    className="rounded-lg border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : companyName ? (
                  <div className="w-30 h-30 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg border border-border" style={{ width: '120px', height: '120px' }}>
                    <span className="text-4xl font-bold text-white">
                      {companyName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Company Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Name"
                required
              />
            </div>

            {/* Company Email */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Company Email
              </label>
              <Input
                value={companyEmail}
                disabled
                className="bg-secondary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your email address (cannot be changed here)
              </p>
            </div>

            {/* Company Website */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Company Website
              </label>
              <Input
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                type="url"
              />
              {companyWebsite && (
                <a
                  href={companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center gap-1 mt-2"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Company Introduction */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                About Your Company
              </label>
              <Textarea
                value={companyIntro}
                onChange={(e) => setCompanyIntro(e.target.value)}
                placeholder="Tell us about your company, its mission, and what makes it unique..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Brief introduction about your company that will be visible on challenge pages
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                onClick={handleUpdateProfile}
                disabled={isSaving || !companyName.trim()}
                className="flex items-center gap-2 w-full"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Company Preview */}
        {companyName && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Company Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  width={80}
                  height={80}
                  className="rounded-lg border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg border border-border">
                  <span className="text-2xl font-bold text-white">
                    {companyName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{companyName}</h3>
                {companyIntro && (
                  <p className="text-muted-foreground text-sm">
                    {companyIntro}
                  </p>
                )}
                {companyWebsite && (
                  <a
                    href={companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm flex items-center gap-1 mt-2"
                  >
                    <Globe className="h-4 w-4" />
                    {companyWebsite}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {companyEmail && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <Mail className="h-4 w-4" />
                    {companyEmail}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
