'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, LayoutDashboard, Trophy, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function SponsorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sponsor Navigation Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/sponsor" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-accent-foreground" />
              <div>
                <h1 className="text-xl font-bold">BuildAI Arena</h1>
                <p className="text-xs text-muted-foreground">Sponsor Dashboard</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/sponsor"
                className="flex items-center gap-2 text-foreground hover:text-accent-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/sponsor/challenges"
                className="flex items-center gap-2 text-foreground hover:text-accent-foreground transition-colors"
              >
                <Trophy className="h-4 w-4" />
                <span>My Challenges</span>
              </Link>
              <Link
                href="/sponsor/profile"
                className="flex items-center gap-2 text-foreground hover:text-accent-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Company Profile</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link
                href="/challenges"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View Builder Arena
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border bg-white text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
