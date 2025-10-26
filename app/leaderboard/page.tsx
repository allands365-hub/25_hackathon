'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/hooks';

export default function LeaderboardPage() {
  const { isSponsor } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Global Leaderboard</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            See the top AI builders across all challenges
          </p>
        </div>

        <Card className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Coming Soon</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            We're working on a global leaderboard that will show the top performers across all challenges. 
            For now, you can view individual challenge leaderboards on each challenge page.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 mb-8">
            <Clock className="h-4 w-4" />
            <span>Expected launch: Q1 2026</span>
          </div>
          
          {/* Role-aware navigation */}
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href={isSponsor ? "/sponsor" : "/challenges"} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to {isSponsor ? "Sponsor Dashboard" : "Challenges"}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
