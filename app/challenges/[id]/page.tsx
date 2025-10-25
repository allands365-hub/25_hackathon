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
        .select('*')
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
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Challenge Header */}
        <Card className="p-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  {challenge.title}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  {challenge.description}
                </p>
              </div>
              {challenge.sponsor_name && (
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Sponsored by</p>
                  <p className="font-semibold text-lg">{challenge.sponsor_name}</p>
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
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Problem Statement</h2>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-zinc-700 dark:text-zinc-300">
              {challenge.problem_statement}
            </pre>
          </div>
        </Card>

        {/* Evaluation Rubric */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Evaluation Rubric</h2>
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
          <Button 
            size="lg" 
            className="px-8"
            onClick={() => setIsDialogOpen(true)}
          >
            Submit Your Project
          </Button>
        </div>

        {/* Multi-step Submission Form */}
        <SubmissionForm
          challenge={challenge}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleSubmissionSuccess}
        />

        {/* Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
          <Leaderboard challengeId={challenge.id} limit={10} />
        </div>
      </div>
    </div>
  );
}
