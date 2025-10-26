'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ManualScoreForm } from '@/components/ManualScoreForm';
import { ReviewHistory } from '@/components/ReviewHistory';
import Link from 'next/link';
import {
  ArrowLeft,
  Github,
  FileText,
  Video,
  User,
  Calendar,
  Brain,
  Star,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionData {
  id: string;
  created_at: string;
  repo_url: string;
  deck_url: string | null;
  video_url: string | null;
  summary: string;
  status: string;
  challenge: {
    id: string;
    title: string;
    rubric: any;
    created_by: string;
  };
  user: {
    username: string;
    avatar_url: string | null;
    email: string | null;
    github_id: string;
  };
  evaluation?: {
    score: number;
    criterion_scores: Record<string, number>;
    feedback: string;
    evaluated_at: string;
  };
  manual_review?: {
    score: number;
    criterion_scores: Record<string, number>;
    feedback: string;
    reviewed_at: string;
  };
}

export default function ReviewSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const { profile, isLoading: authLoading } = useAuth();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const challengeId = params.id as string; // Changed from challengeId to id
  const submissionId = params.submissionId as string;

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role !== 'sponsor') {
        router.push('/challenges');
        return;
      }
      fetchSubmission();
    }
  }, [profile, authLoading, submissionId, router]);

  const fetchSubmission = async () => {
    if (!profile) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(
          `
          *,
          challenges!inner(id, title, rubric, created_by),
          users!inner(username, avatar_url, email, github_id),
          evaluations(score, criterion_scores, feedback, evaluated_at),
          manual_reviews!left(score, criterion_scores, feedback, reviewed_at, reviewer_id)
        `
        )
        .eq('id', submissionId)
        .single();

      if (error) throw error;

      // Verify challenge ownership
      if (data.challenges.created_by !== profile.id) {
        toast.error('You do not have permission to review this submission');
        router.push('/sponsor/challenges');
        return;
      }

      // Filter manual reviews to get only the current user's review
      const userReview = data.manual_reviews?.find(
        (review: any) => review.reviewer_id === profile.id
      );

      const formattedData: SubmissionData = {
        id: data.id,
        created_at: data.created_at,
        repo_url: data.repo_url,
        deck_url: data.deck_url,
        video_url: data.video_url,
        summary: data.summary,
        status: data.status,
        challenge: {
          id: data.challenges.id,
          title: data.challenges.title,
          rubric: data.challenges.rubric,
          created_by: data.challenges.created_by,
        },
        user: {
          username: data.users.username,
          avatar_url: data.users.avatar_url,
          email: data.users.email,
          github_id: data.users.github_id,
        },
        evaluation: data.evaluations?.[0] || undefined,
        manual_review: userReview || undefined,
      };

      setSubmission(formattedData);
    } catch (error) {
      console.error('Error fetching submission:', error);
      toast.error('Failed to load submission');
      router.push(`/sponsor/challenges/${challengeId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSuccess = () => {
    toast.success('Review submitted successfully!');
    fetchSubmission(); // Refresh to show updated review
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  const hybridScore = submission.evaluation && submission.manual_review
    ? Math.round((submission.evaluation.score * 0.5) + (submission.manual_review.score * 0.5))
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/sponsor/challenges/${challengeId}`}
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Challenge
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Review Submission</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Challenge: {submission.challenge.title}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Submission Details */}
        <div className="space-y-6">
          {/* Builder Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <img
                  src={submission.user.avatar_url || '/default-avatar.png'}
                  alt={submission.user.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-lg">{submission.user.username}</p>
                  <p className="text-sm text-zinc-500 font-normal">
                    Submitted {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`https://github.com/${submission.user.github_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub Profile
                  </a>
                </Button>
                {submission.user.email && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${submission.user.email}`}>
                      Contact Builder
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Links */}
          <Card>
            <CardHeader>
              <CardTitle>Project Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <a href={submission.repo_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 mr-3" />
                  View GitHub Repository
                </a>
              </Button>
              {submission.deck_url && (
                <Button asChild variant="outline" className="w-full justify-start" size="lg">
                  <a href={submission.deck_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-5 w-5 mr-3" />
                    View Pitch Deck
                  </a>
                </Button>
              )}
              {submission.video_url && (
                <Button asChild variant="outline" className="w-full justify-start" size="lg">
                  <a href={submission.video_url} target="_blank" rel="noopener noreferrer">
                    <Video className="h-5 w-5 mr-3" />
                    Watch Demo Video
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {submission.summary}
              </p>
            </CardContent>
          </Card>

          {/* LLM Evaluation */}
          {submission.evaluation && (
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <CardTitle>AI Evaluation</CardTitle>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    LLM Score: {submission.evaluation.score}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Criterion Breakdown */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Criterion Scores:</p>
                  {Object.entries(submission.evaluation.criterion_scores).map(([name, score]) => (
                    <div key={name} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">{name}</span>
                      <span className="font-medium">{score}/100</span>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div>
                  <p className="text-sm font-medium mb-2">AI Feedback:</p>
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                      {submission.evaluation.feedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hybrid Score Display */}
          {hybridScore !== null && (
            <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <CardTitle>Hybrid Score</CardTitle>
                  </div>
                  <Badge className="text-lg px-4 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                    {hybridScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  50% AI ({submission.evaluation?.score}) + 50% Human ({submission.manual_review?.score}) = <strong>{hybridScore}</strong>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Manual Review Form */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <CardTitle>
                  {submission.manual_review ? 'Your Review' : 'Manual Review'}
                </CardTitle>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {submission.manual_review
                  ? 'Update your evaluation scores and feedback'
                  : 'Evaluate this submission against the challenge criteria'}
              </p>
            </CardHeader>
            <CardContent>
              <ManualScoreForm
                submissionId={submission.id}
                challengeId={submission.challenge.id}
                rubric={submission.challenge.rubric}
                existingReview={submission.manual_review}
                onSuccess={handleReviewSuccess}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review History Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">All Reviews for This Submission</h2>
        <ReviewHistory submissionId={submission.id} />
      </div>
    </div>
  );
}
