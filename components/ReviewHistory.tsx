'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, User, Calendar, Award } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  submission_id: string;
  reviewer_id: string;
  score: number;
  criterion_scores: Record<string, number>;
  feedback: string;
  reviewed_at: string;
  reviewer: {
    username: string;
    avatar_url: string | null;
    company_name: string | null;
  };
  submission?: {
    user: {
      username: string;
      avatar_url: string | null;
    };
  };
}

interface ReviewHistoryProps {
  submissionId?: string;
  challengeId?: string;
  showSubmissionInfo?: boolean; // Show which submission was reviewed (for challenge-wide view)
}

export function ReviewHistory({
  submissionId,
  challengeId,
  showSubmissionInfo = false,
}: ReviewHistoryProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [submissionId, challengeId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      if (submissionId) params.append('submissionId', submissionId);
      if (challengeId) params.append('challengeId', challengeId);

      const response = await fetch(`/api/manual-review?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-300';
    if (score >= 60) return 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-300';
    return 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-300';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
            No reviews yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {submissionId
              ? 'This submission has not been reviewed yet'
              : 'No submissions have been reviewed yet'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-start justify-between gap-4">
              {/* Reviewer Info */}
              <div className="flex items-center gap-3">
                {review.reviewer?.avatar_url ? (
                  <Image
                    src={review.reviewer.avatar_url}
                    alt={review.reviewer.username || 'Reviewer'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-zinc-600" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.reviewer?.username || 'Unknown Reviewer'}</p>
                    {review.reviewer?.company_name && (
                      <Badge variant="outline" className="text-xs">
                        {review.reviewer.company_name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(review.reviewed_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-right">
                <Badge className={`text-lg px-3 py-1 ${getScoreColor(review.score)}`}>
                  <Award className="h-4 w-4 mr-1" />
                  {review.score}/100
                </Badge>
              </div>
            </div>

            {/* Submission Info (for challenge-wide view) */}
            {showSubmissionInfo && review.submission && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Reviewing submission by:</p>
                  {review.submission?.user?.avatar_url ? (
                    <Image
                      src={review.submission.user.avatar_url}
                      alt={review.submission.user.username || 'Builder'}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : null}
                  <p className="text-sm font-medium">{review.submission?.user?.username || 'Unknown Builder'}</p>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {/* Criterion Scores */}
            <div>
              <p className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
                Score Breakdown
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(review.criterion_scores).map(([criterion, score]) => (
                  <div
                    key={criterion}
                    className="flex items-center justify-between p-2 rounded-md bg-zinc-50 dark:bg-zinc-900"
                  >
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate mr-2">
                      {criterion}
                    </span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {score}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <p className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-600" />
                Written Feedback
              </p>
              <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {review.feedback}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
