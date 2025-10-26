'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/hooks';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  deadline: string;
  sponsor_name: string;
  created_by: string;
  created_at: string;
}

export default function ChallengesPage() {
  const { isSponsor } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (difficultyFilter === 'all') {
      setFilteredChallenges(challenges);
    } else {
      setFilteredChallenges(
        challenges.filter((c) => c.difficulty === difficultyFilter)
      );
    }
  }, [difficultyFilter, challenges]);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          creator:users!created_by(id, username, company_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
      setFilteredChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-50 dark:bg-green-950';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
      case 'Advanced':
        return 'text-red-600 bg-red-50 dark:bg-red-950';
      default:
        return 'text-zinc-600 bg-zinc-50 dark:bg-zinc-950';
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>

          {/* Filters Skeleton */}
          <div className="mb-6 flex gap-4 items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Challenge Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  {/* Header Skeleton */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>

                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>

                  {/* Footer Skeleton */}
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4" data-testid="challenges-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {isSponsor && (
              <Button asChild variant="outline" size="sm" data-testid="back-to-dashboard-btn">
                <Link href="/sponsor" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100" data-testid="challenges-page-heading">
            {isSponsor ? "Builder Arena" : "Challenges"}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400" data-testid="challenges-page-description">
            {isSponsor
              ? "See what challenges builders are working on in the arena"
              : "Build AI products, get evaluated by LLM, and climb the leaderboard"
            }
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 items-center" data-testid="challenges-filters">
          <label className="text-sm font-medium">Filter by difficulty:</label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            data-testid="difficulty-filter-select"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <span className="text-sm text-zinc-500" data-testid="challenge-count">
            {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Challenge Grid */}
        {filteredChallenges.length === 0 ? (
          <Card className="p-12 text-center" data-testid="no-challenges-message">
            <p className="text-zinc-600 dark:text-zinc-400">
              No challenges found for this difficulty level.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2" data-testid="challenges-grid">
            {filteredChallenges.map((challenge) => {
              const daysRemaining = getDaysRemaining(challenge.deadline);

              return (
                    <Card key={challenge.id} className="p-6 hover-lift cursor-pointer" data-testid={`challenge-card-${challenge.id}`}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100" data-testid="challenge-title">{challenge.title}</h2>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                            challenge.difficulty
                          )}`}
                          data-testid="challenge-difficulty"
                        >
                          {challenge.difficulty}
                        </span>
                      </div>
                      {(challenge as any).creator && (
                        <div className="text-right">
                          <p className="text-xs text-zinc-500 mb-1 flex items-center justify-end gap-1">
                            <Building2 className="h-3 w-3" />
                            Challenge by
                          </p>
                          <Link 
                            href={`/users/${(challenge as any).creator.id}`}
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center justify-end gap-1"
                          >
                            {(challenge as any).creator.company_name || (challenge as any).creator.username}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3" data-testid="challenge-description">
                      {challenge.description}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="text-sm" data-testid="challenge-deadline">
                        {daysRemaining > 0 ? (
                          <span className="text-zinc-600">
                            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                          </span>
                        ) : (
                          <span className="text-red-600">Deadline passed</span>
                        )}
                      </div>
                      <Button asChild data-testid="view-challenge-btn">
                        <Link href={`/challenges/${challenge.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
