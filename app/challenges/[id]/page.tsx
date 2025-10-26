'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaderboard } from '@/components/Leaderboard';
import { SubmissionForm } from '@/components/SubmissionForm';
import { toast } from 'sonner';
import { Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  problem_statement: string;
  rubric: {
    criteria: Array<{
      name: string;
      weight: number;
      description: string;
    }>;
  };
  difficulty: string;
  deadline: string;
  sponsor_name: string;
  sponsor_logo_url: string | null;
  created_by: string;
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, profile } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchChallenge(params.id as string);
    }
  }, [params.id]);

  const fetchChallenge = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          creator:users!created_by(id, username, company_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setChallenge(data);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast.error('Challenge not found');
      router.push('/challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmissionSuccess = () => {
    // Refresh the page to show updated leaderboard
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600">Loading challenge...</p>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4" data-testid="challenge-detail-page">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Challenge Header */}
        <Card className="p-8" data-testid="challenge-header-card">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold tracking-tight mb-2" data-testid="challenge-detail-title">
                  {challenge.title}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg" data-testid="challenge-detail-description">
                  {challenge.description}
                </p>
              </div>
              {(challenge as any).creator && (
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1 flex items-center justify-end gap-1">
                    <Building2 className="h-3 w-3" />
                    Challenge by
                  </p>
                  <Link 
                    href={`/users/${(challenge as any).creator.id}`}
                    className="font-semibold text-lg text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center justify-end gap-1"
                  >
                    {(challenge as any).creator.company_name || (challenge as any).creator.username}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="flex gap-4 items-center">
              <span className="px-4 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-sm font-medium">
                {challenge.difficulty}
              </span>
              <span className="text-sm text-zinc-600">
                Deadline: {new Date(challenge.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Problem Statement */}
        <Card className="p-8" data-testid="problem-statement-card">
          <h2 className="text-2xl font-bold mb-4" data-testid="problem-statement-heading">Problem Statement</h2>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-zinc-700 dark:text-zinc-300" data-testid="problem-statement-text">
              {challenge.problem_statement}
            </pre>
          </div>
        </Card>

        {/* Evaluation Rubric */}
        <Card className="p-8" data-testid="evaluation-rubric-card">
          <h2 className="text-2xl font-bold mb-4" data-testid="evaluation-rubric-heading">Evaluation Rubric</h2>
          <div className="space-y-4">
            {challenge.rubric.criteria.map((criterion, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg">{criterion.name}</h3>
                  <span className="text-blue-600 font-bold">{criterion.weight}%</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">{criterion.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          {isAuthenticated ? (
            <Button
              size="lg"
              className="px-8"
              onClick={() => setIsDialogOpen(true)}
              data-testid="submit-project-btn"
            >
              Submit Your Project
            </Button>
          ) : (
            <Card className="p-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Sign in to submit your project
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You need to sign in to participate in this challenge
                </p>
                <Button asChild size="lg" className="px-8">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Multi-step Submission Form */}
        <SubmissionForm
          challenge={challenge}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleSubmissionSuccess}
        />

        {/* Leaderboard */}
        <div data-testid="challenge-leaderboard-section">
          <h2 className="text-2xl font-bold mb-6" data-testid="leaderboard-heading">Leaderboard</h2>
          <Leaderboard challengeId={challenge.id} limit={10} />
        </div>
      </div>
    </div>
  );
}
