'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { ChallengeForm } from '@/components/ChallengeForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditChallengePage() {
  const router = useRouter();
  const params = useParams();
  const { profile, isLoading: authLoading } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const challengeId = params.id as string;

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role !== 'sponsor') {
        router.push('/challenges');
        return;
      }
      fetchChallenge();
    }
  }, [profile, authLoading, challengeId, router]);

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (error) throw error;

      // Verify ownership
      if (data.created_by !== profile?.id) {
        toast.error('You do not have permission to edit this challenge');
        router.push('/sponsor/challenges');
        return;
      }

      setChallenge(data);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast.error('Challenge not found');
      router.push('/sponsor/challenges');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  // Transform challenge data to match form expectations
  const initialData = {
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    deadline: new Date(challenge.deadline).toISOString().slice(0, 16), // Format for datetime-local
    problemStatement: challenge.problem_statement,
    criteria: challenge.rubric.criteria,
    prizeAmount: challenge.prize_amount,
    prizeCurrency: challenge.prize_currency,
    isPublished: challenge.is_published,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/sponsor/challenges"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Challenges
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Challenge</h1>
        <p className="text-muted-foreground mt-2">
          Update your challenge details and settings
        </p>
      </div>

      {/* Challenge Form */}
      <ChallengeForm mode="edit" initialData={initialData} challengeId={challengeId} />
    </div>
  );
}
