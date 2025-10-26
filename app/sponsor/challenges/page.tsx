'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  deadline: string;
  prize_amount: number;
  prize_currency: string;
  is_published: boolean;
  created_at: string;
  submission_count?: number;
}

export default function SponsorshallengesPage() {
  const router = useRouter();
  const { profile, isLoading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role !== 'sponsor') {
        router.push('/challenges');
        return;
      }
      fetchChallenges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, authLoading, router]);

  const fetchChallenges = async () => {
    if (!profile) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('created_by', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch submission counts for each challenge
      const challengesWithCounts = await Promise.all(
        (data || []).map(async (challenge) => {
          const { count } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('challenge_id', challenge.id);

          return {
            ...challenge,
            submission_count: count || 0,
          };
        })
      );

      setChallenges(challengesWithCounts);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete challenge');
      }

      toast.success('Challenge deleted successfully');
      fetchChallenges(); // Refresh list
    } catch (error) {
      console.error('Error deleting challenge:', error);
      toast.error('Failed to delete challenge');
    }
  };

  const handleTogglePublish = async (challengeId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update challenge');
      }

      toast.success(currentStatus ? 'Challenge unpublished' : 'Challenge published');
      fetchChallenges(); // Refresh list
    } catch (error) {
      console.error('Error updating challenge:', error);
      toast.error('Failed to update challenge');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Challenges</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Manage your AI product challenges
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/sponsor/challenges/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Link>
        </Button>
      </div>

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <Card className="text-center py-16 hover-lift">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Plus className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Start Discovering Talent
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                Create your first challenge to start discovering top AI builders and building your team
              </p>
              <Button asChild size="lg" className="transition-all hover:scale-105">
                <Link href="/sponsor/challenges/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Challenge
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {challenges.map((challenge) => {
            const daysRemaining = Math.ceil(
              (new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            const isExpired = daysRemaining < 0;

            return (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{challenge.title}</CardTitle>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        {challenge.is_published ? (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-zinc-500" />
                      <span className={isExpired ? 'text-red-600' : ''}>
                        {isExpired
                          ? 'Expired'
                          : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-zinc-500" />
                      <span>{challenge.submission_count} submissions</span>
                    </div>
                    {challenge.prize_amount > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-zinc-500" />
                        <span>
                          {challenge.prize_currency} {challenge.prize_amount}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/challenges/${challenge.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/sponsor/challenges/${challenge.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(challenge.id, challenge.is_published)}
                    >
                      {challenge.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(challenge.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
