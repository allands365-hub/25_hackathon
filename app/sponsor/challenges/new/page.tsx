'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import { ChallengeForm } from '@/components/ChallengeForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewChallengePage() {
  const router = useRouter();
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'sponsor')) {
      router.push('/challenges');
    }
  }, [profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/sponsor/challenges"
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Challenges
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Challenge</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Design a challenge to discover top AI builders
        </p>
      </div>

      {/* Challenge Form */}
      <ChallengeForm mode="create" />
    </div>
  );
}
