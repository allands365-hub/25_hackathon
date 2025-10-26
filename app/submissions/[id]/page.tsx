'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ExternalLink, 
  Github, 
  FileText, 
  Video, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Loader2,
  ArrowLeft,
  Trophy,
  Star
} from 'lucide-react';

interface SubmissionData {
  id: string;
  challenge_id: string;
  user_id: string;
  repo_url: string;
  deck_url: string;
  video_url: string;
  summary: string;
  status: 'pending' | 'evaluating' | 'scored';
  created_at: string;
  challenge: {
    id: string;
    title: string;
    description: string;
  };
  evaluation?: {
    id: string;
    score: number;
    criterion_scores: Record<string, number>;
    feedback: string;
    evaluated_at: string;
  };
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, profile } = useAuth();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchSubmission(params.id as string);
    }
  }, [params.id]);

  const fetchSubmission = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Submissions are publicly viewable according to RLS policies

      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          challenge:challenges(id, title, description),
          evaluation:evaluations(id, score, criterion_scores, feedback, evaluated_at)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Submission not found');
        } else if (error.code === '42501') {
          setError('Access denied');
        } else {
          throw error;
        }
        return;
      }

      // Note: Submissions are viewable by everyone according to RLS policies
      // We'll handle owner-specific features in the UI

      setSubmission(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
      setError('Failed to load submission');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!submission) return;
    
    setIsRefreshing(true);
    await fetchSubmission(submission.id);
    setIsRefreshing(false);
    toast.success('Submission data refreshed');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Queued for Evaluation
          </Badge>
        );
      case 'evaluating':
        return (
          <Badge variant="default" className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Evaluating...
          </Badge>
        );
      case 'scored':
        return (
          <Badge variant="default" className="flex items-center gap-2 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Evaluated
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVideoEmbedUrl = (url: string | null) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('loom.com/share/')) {
      return url.replace('/share/', '/embed/');
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 mb-4">
                {error === 'Submission not found' ? '404' : '403'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 mb-6">
                {error === 'Submission not found' 
                  ? 'This submission could not be found.' 
                  : 'You do not have permission to view this submission.'
                }
              </p>
              <Button onClick={() => router.push('/profile')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  const videoEmbedUrl = getVideoEmbedUrl(submission.video_url);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Submission Details
              {profile && submission.user_id === profile.id && (
                <Badge variant="secondary" className="ml-3">Your Submission</Badge>
              )}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Submitted on {new Date(submission.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {getStatusBadge(submission.status)}
            {profile && submission.user_id === profile.id && (
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* Challenge Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">
              <button
                onClick={() => router.push(`/challenges/${submission.challenge_id}`)}
                className="text-blue-600 hover:underline"
              >
                {submission.challenge.title}
              </button>
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {submission.challenge.description}
            </p>
          </CardContent>
        </Card>

        {/* Submission Info */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* GitHub Repository */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Github className="h-4 w-4" />
                GitHub Repository
              </label>
              <a
                href={submission.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                {submission.repo_url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Pitch Deck */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FileText className="h-4 w-4" />
                Pitch Deck
              </label>
              <a
                href={submission.deck_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                {submission.deck_url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Demo Video */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Video className="h-4 w-4" />
                Demo Video
              </label>
              <div className="space-y-2">
                <a
                  href={submission.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  {submission.video_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
                {videoEmbedUrl && (
                  <div className="mt-4">
                    <iframe
                      src={videoEmbedUrl}
                      width="100%"
                      height="315"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="text-sm font-medium mb-2 block">Project Summary</label>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="whitespace-pre-wrap break-words overflow-hidden text-zinc-700 dark:text-zinc-300">
                  {submission.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Results */}
        {submission.status === 'scored' && submission.evaluation ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Evaluation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  {submission.evaluation.score}/100
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Overall Score
                </p>
              </div>

              {/* Criterion Breakdown */}
              {submission.evaluation.criterion_scores && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Score Breakdown</h4>
                  <div className="space-y-4">
                    {Object.entries(submission.evaluation.criterion_scores).map(([criterion, score]) => (
                      <div key={criterion} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">
                            {criterion.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm text-zinc-600">
                            {score}/100
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Feedback</h4>
                <blockquote className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                    {submission.evaluation.feedback}
                  </p>
                </blockquote>
              </div>

              <div className="text-sm text-zinc-500 text-center">
                Evaluated on {new Date(submission.evaluation.evaluated_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Pending/Evaluating State */
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Status</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="space-y-4">
                {submission.status === 'pending' && (
                  <>
                    <Clock className="h-12 w-12 text-blue-500 mx-auto" />
                    <h3 className="text-xl font-semibold">Queued for Evaluation</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Your submission is in the evaluation queue. This typically takes less than 30 seconds.
                    </p>
                  </>
                )}
                {submission.status === 'evaluating' && (
                  <>
                    <Loader2 className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
                    <h3 className="text-xl font-semibold">Evaluating Your Project</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Our AI is analyzing your submission. This typically takes less than 30 seconds.
                    </p>
                  </>
                )}
                <p className="text-sm text-zinc-500">
                  Refresh the page to see the latest status and results.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => router.push(profile && submission.user_id === profile.id ? '/profile' : '/challenges')} 
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {profile && submission.user_id === profile.id ? 'Back to Profile' : 'Back to Challenges'}
          </Button>
        </div>
      </div>
    </div>
  );
}
