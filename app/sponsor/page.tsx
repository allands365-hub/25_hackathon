'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Trophy,
  Users,
  Star,
  Clock,
  Plus,
  Eye,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface DashboardStats {
  total_challenges: number;
  active_challenges: number;
  total_submissions: number;
  pending_reviews: number;
}

interface RecentSubmission {
  id: string;
  created_at: string;
  summary: string;
  challenge_id: string;
  challenge_title: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  llm_score: number | null;
  has_review: boolean;
}

export default function SponsorDashboard() {
  const router = useRouter();
  const { profile, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!profile) return;

    setIsLoading(true);

    try {
      // Fetch challenges stats
      const { data: challenges, error: challengesError } = await supabase
        .from('challenges')
        .select('id, is_published, deadline')
        .eq('created_by', profile.id);

      if (challengesError) throw challengesError;

      const activeChallenges = challenges?.filter(
        (c) => c.is_published && new Date(c.deadline) > new Date()
      ).length || 0;

      // Fetch submissions stats
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('id, challenge_id, challenges!inner(created_by)')
        .eq('challenges.created_by', profile.id);

      if (submissionsError) throw submissionsError;

      // Fetch manual reviews to calculate pending
      const { data: reviews, error: reviewsError } = await supabase
        .from('manual_reviews')
        .select('submission_id')
        .eq('reviewer_id', profile.id);

      if (reviewsError) throw reviewsError;

      const reviewedSubmissionIds = new Set(reviews?.map((r) => r.submission_id) || []);
      const pendingReviews =
        submissions?.filter((s) => !reviewedSubmissionIds.has(s.id)).length || 0;

      setStats({
        total_challenges: challenges?.length || 0,
        active_challenges: activeChallenges,
        total_submissions: submissions?.length || 0,
        pending_reviews: pendingReviews,
      });

      // Fetch recent submissions
      const { data: recentData, error: recentError } = await supabase
        .from('submissions')
        .select(
          `
          id,
          created_at,
          summary,
          challenge_id,
          user_id,
          challenges!inner(title, created_by),
          users!inner(username, avatar_url),
          evaluations(score),
          manual_reviews!left(id)
        `
        )
        .eq('challenges.created_by', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      const formattedSubmissions: RecentSubmission[] = (recentData || []).map((sub: any) => ({
        id: sub.id,
        created_at: sub.created_at,
        summary: sub.summary,
        challenge_id: sub.challenge_id,
        challenge_title: sub.challenges.title,
        user_id: sub.user_id,
        username: sub.users.username,
        avatar_url: sub.users.avatar_url,
        llm_score: sub.evaluations?.[0]?.score || null,
        has_review: (sub.manual_reviews?.length || 0) > 0,
      }));

      setRecentSubmissions(formattedSubmissions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role !== 'sponsor') {
        router.push('/challenges');
        return;
      }
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome back, {profile?.company_name || profile?.username}!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Here's what's happening with your challenges
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Challenges</p>
                <p className="text-3xl font-bold">{stats?.total_challenges || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-full">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Active Challenges</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.active_challenges || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-950 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold">{stats?.total_submissions || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats?.pending_reviews || 0}
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-950 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/sponsor/challenges/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Challenge
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/sponsor/challenges">
                <Eye className="h-4 w-4 mr-2" />
                View All Challenges
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Creating Effective Challenges</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Learn how to write clear problem statements and evaluation rubrics
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Reviewing Submissions</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Best practices for evaluating builder submissions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Submissions</CardTitle>
            <Link
              href="/sponsor/challenges"
              className="text-sm text-purple-600 hover:underline"
            >
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                No submissions yet
              </p>
              <Button asChild>
                <Link href="/sponsor/challenges/new">Create Your First Challenge</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  {/* User Avatar */}
                  <img
                    src={submission.avatar_url || '/default-avatar.png'}
                    alt={submission.username}
                    className="w-10 h-10 rounded-full"
                  />

                  {/* Submission Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{submission.username}</span>
                      <span className="text-sm text-zinc-500">submitted to</span>
                      <span className="text-sm font-medium text-purple-600">
                        {submission.challenge_title}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                      {submission.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                      {submission.llm_score !== null && (
                        <Badge variant="secondary">LLM Score: {submission.llm_score}/100</Badge>
                      )}
                      {submission.has_review ? (
                        <Badge variant="default">Reviewed</Badge>
                      ) : (
                        <Badge variant="outline">Pending Review</Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/sponsor/challenges/${submission.challenge_id}/review/${submission.id}`}
                    >
                      {submission.has_review ? 'View Review' : 'Review'}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
