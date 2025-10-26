'use client';

import { useAuth } from '@/lib/auth/hooks';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { isAuthenticated, profile, signOut, isSponsor } = useAuth();
  const pathname = usePathname();

  // Don't render global navigation on sponsor routes (they have their own navigation)
  if (pathname?.startsWith('/sponsor')) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isSponsor ? "/sponsor" : "/"} className="flex items-center gap-2" data-testid="nav-logo">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              BuildAI Arena
            </span>
            {isSponsor && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full" data-testid="sponsor-badge">
                Sponsor
              </span>
            )}
          </Link>

          {/* Nav Links - Dynamic based on role and auth status */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              // Not signed in - public navigation
              <>
                <Link
                  href="/challenges"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                  data-testid="nav-challenges"
                >
                  Challenges
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                  data-testid="nav-leaderboard"
                >
                  Leaderboard
                </Link>
              </>
            ) : isSponsor ? (
              // Sponsor navigation (authenticated)
              <>
                <Link
                  href="/sponsor"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/sponsor/challenges"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                >
                  My Challenges
                </Link>
                <Link
                  href="/challenges"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                >
                  View Arena
                </Link>
              </>
            ) : (
              // Builder navigation (authenticated)
              <>
                <Link
                  href="/challenges"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                >
                  Challenges
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/profile"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
                >
                  My Profile
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4" data-testid="nav-auth-section">
            <ThemeToggle />
            {isAuthenticated && profile ? (
              <>
                <Link
                  href={isSponsor ? "/sponsor" : "/profile"}
                  className="flex items-center gap-2"
                  data-testid="nav-user-profile"
                >
                  {profile.avatar_url && (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                      data-testid="nav-user-avatar"
                    />
                  )}
                  <span className="hidden sm:inline text-sm font-medium text-zinc-900 dark:text-zinc-100" data-testid="nav-username">
                    {profile.username}
                  </span>
                </Link>
                <Button onClick={signOut} variant="outline" size="sm" data-testid="nav-signout-btn">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild data-testid="nav-signin-btn">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
