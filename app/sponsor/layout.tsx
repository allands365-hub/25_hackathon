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
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Sponsor Navigation Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/sponsor" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold">BuildAI Arena</h1>
                <p className="text-xs text-zinc-500">Sponsor Dashboard</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/sponsor"
                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/sponsor/challenges"
                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Trophy className="h-4 w-4" />
                <span>My Challenges</span>
              </Link>
              <Link
                href="/sponsor/profile"
                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Company Profile</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link
                href="/challenges"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                View Builder Arena
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
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
