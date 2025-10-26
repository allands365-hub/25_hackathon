'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ExternalLink, Trophy, Medal, Award, Brain, Star, Crown } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  submission_id: string;
  username: string;
  avatar_url: string | null;
  score: number;
  llm_score?: number;
  manual_score?: number;
  score_type: 'hybrid' | 'llm_only' | 'manual_only';
  rank: number;
  submitted_at: string;
  repo_url: string;
  deck_url: string | null;
  video_url: string | null;
  is_new?: boolean;
  is_user_submission?: boolean;
}

interface LeaderboardProps {
  challengeId: string;
  limit?: number;
}

export function Leaderboard({ challengeId, limit = 10 }: LeaderboardProps) {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);
  const [useViewQuery, setUseViewQuery] = useState(true);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    fetchLeaderboard();
    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [challengeId]);

  const setupRealtimeSubscription = () => {
    // Clean up existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Set up new subscription for both evaluations and manual_reviews table changes
    const channel = supabase
      .channel(`leaderboard-${challengeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'evaluations',
        },
        async (payload) => {
          console.log('New evaluation detected:', payload);
          // Check if this evaluation is for a submission in this challenge
          const { data: submission } = await supabase
            .from('submissions')
            .select('challenge_id')
            .eq('id', payload.new.submission_id)
            .single();

          if (submission?.challenge_id === challengeId) {
            // Mark new entry and refetch
            setNewEntryId(payload.new.submission_id);
            await fetchLeaderboard();

            // Clear new entry highlight after 2 seconds
            setTimeout(() => {
              setNewEntryId(null);
            }, 2000);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manual_reviews',
        },
        async (payload: any) => {
          console.log('Manual review change detected:', payload);
          // Check if this review is for a submission in this challenge
          const { data: submission } = await supabase
            .from('submissions')
            .select('challenge_id')
            .eq('id', payload.new?.submission_id || payload.old?.submission_id)
            .single();

          if (submission?.challenge_id === challengeId) {
            // Refetch to update hybrid scores
            await fetchLeaderboard();
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  };

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);

      // Try using the leaderboard view first (includes hybrid scores)
      if (useViewQuery) {
        const { data: viewData, error: viewError } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('challenge_id', challengeId)
          .order('score', { ascending: false })
          .limit(limit);

        if (viewError) {
          // View doesn't exist yet, fall back to direct query
          console.log('Leaderboard view not found, falling back to direct query');
          setUseViewQuery(false);
        } else if (viewData) {
          // Transform view data to match our interface
          const transformedData = (viewData || []).map((item, index) => {
            const hasManualReview = item.manual_score !== null;
            const hasLlmScore = item.llm_score !== null;

            let scoreType: 'hybrid' | 'llm_only' | 'manual_only';
            if (hasManualReview && hasLlmScore) {
              scoreType = 'hybrid';
            } else if (hasManualReview) {
              scoreType = 'manual_only';
            } else {
              scoreType = 'llm_only';
            }

            return {
              id: item.submission_id,
              user_id: item.user_id,
              submission_id: item.submission_id,
              username: item.username,
              avatar_url: item.avatar_url,
              score: item.score,
              llm_score: item.llm_score,
              manual_score: item.manual_score,
              score_type: scoreType,
              rank: index + 1,
              submitted_at: item.submitted_at,
              repo_url: item.repo_url,
              deck_url: item.deck_url,
              video_url: item.video_url,
              is_new: item.submission_id === newEntryId,
              is_user_submission: profile?.id === item.user_id,
            };
          });

          setEntries(transformedData);
          setIsLoading(false);
          return;
        }
      }

      // Fallback: Direct query with manual joins (for when view doesn't exist)
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          user_id,
          repo_url,
          deck_url,
          video_url,
          created_at,
          users!inner(username, avatar_url),
          evaluations(score),
          manual_reviews(score)
        `)
        .eq('challenge_id', challengeId)
        .limit(limit);

      if (error) throw error;

      // Calculate scores and sort manually
      const transformedData = (data || [])
        .map((item) => {
          const llmScore = item.evaluations?.[0]?.score || null;
          const manualScore = item.manual_reviews?.[0]?.score || null;

          let finalScore: number;
          let scoreType: 'hybrid' | 'llm_only' | 'manual_only';

          if (llmScore !== null && manualScore !== null) {
            // Hybrid score: 50% LLM + 50% Manual
            finalScore = Math.round((llmScore * 0.5) + (manualScore * 0.5));
            scoreType = 'hybrid';
          } else if (manualScore !== null) {
            finalScore = manualScore;
            scoreType = 'manual_only';
          } else if (llmScore !== null) {
            finalScore = llmScore;
            scoreType = 'llm_only';
          } else {
            // No scores yet, skip this submission
            return null;
          }

          // Type assertion for nested user data
          const userData = (item as any).users;
          
          return {
            id: item.id,
            user_id: item.user_id,
            submission_id: item.id,
            username: userData?.username || 'Unknown',
            avatar_url: userData?.avatar_url || null,
            score: finalScore,
            llm_score: llmScore,
            manual_score: manualScore,
            score_type: scoreType,
            rank: 0, // Will be set after sorting
            submitted_at: item.created_at,
            repo_url: item.repo_url,
            deck_url: item.deck_url,
            video_url: item.video_url,
            is_new: item.id === newEntryId,
            is_user_submission: profile?.id === item.user_id,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => b.score - a.score)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }));

      setEntries(transformedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return (
      <div className="flex items-center gap-1">
        <Crown className="h-7 w-7 text-yellow-500 animate-pulse-gentle" />
        <span className="text-lg font-black text-yellow-600">#1</span>
      </div>
    );
    if (rank === 2) return (
      <div className="flex items-center gap-1">
        <Medal className="h-6 w-6 text-zinc-400" />
        <span className="text-lg font-bold text-zinc-500">#2</span>
      </div>
    );
    if (rank === 3) return (
      <div className="flex items-center gap-1">
        <Award className="h-6 w-6 text-amber-600" />
        <span className="text-lg font-bold text-amber-600">#3</span>
      </div>
    );
    return <span className="text-lg font-bold text-zinc-400">#{rank}</span>;
  };

  const getScoreBadge = (scoreType: string) => {
    if (scoreType === 'hybrid') {
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
          <Star className="h-3 w-3 mr-1" />
          Hybrid
        </Badge>
      );
    } else if (scoreType === 'llm_only') {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          <Brain className="h-3 w-3 mr-1" />
          AI
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
          <Star className="h-3 w-3 mr-1" />
          Manual
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Desktop Table Skeleton */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <th className="text-left p-4 font-semibold text-zinc-600 dark:text-zinc-400">Rank</th>
                      <th className="text-left p-4 font-semibold text-zinc-600 dark:text-zinc-400">Builder</th>
                      <th className="text-right p-4 font-semibold text-zinc-600 dark:text-zinc-400">Score</th>
                      <th className="text-center p-4 font-semibold text-zinc-600 dark:text-zinc-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="p-4">
                          <Skeleton className="h-6 w-8" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Skeleton className="h-8 w-12 ml-auto" />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card Skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-6 w-8" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
            No submissions evaluated yet
          </h3>
          <p className="text-zinc-500 dark:text-zinc-500">
            Be the first to submit and get evaluated!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="text-left p-4 font-semibold text-zinc-600 dark:text-zinc-400">Rank</th>
                    <th className="text-left p-4 font-semibold text-zinc-600 dark:text-zinc-400">Builder</th>
                    <th className="text-right p-4 font-semibold text-zinc-600 dark:text-zinc-400">Score</th>
                    <th className="text-center p-4 font-semibold text-zinc-600 dark:text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.submission_id}
                      className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                        entry.is_user_submission ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      } ${
                        entry.is_new ? 'animate-pulse bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                          {entry.is_user_submission && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {entry.avatar_url ? (
                            <a href={`/users/${entry.user_id}`} className="hover:opacity-80 transition-opacity">
                              <Image
                                src={entry.avatar_url}
                                alt={entry.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </a>
                          ) : (
                            <a href={`/users/${entry.user_id}`} className="hover:opacity-80 transition-opacity">
                              <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-zinc-600">
                                  {entry.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </a>
                          )}
                          <div>
                            <a 
                              href={`/users/${entry.user_id}`}
                              className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {entry.username}
                            </a>
                            <p className="text-sm text-zinc-500">
                              {new Date(entry.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <div className={`text-4xl font-black ${
                            entry.score >= 90 ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' :
                            entry.score >= 70 ? 'text-blue-600' :
                            entry.score >= 50 ? 'text-amber-600' :
                            'text-zinc-600'
                          }`}>
                            {entry.score}
                          </div>
                          {getScoreBadge(entry.score_type)}
                          {entry.score_type === 'hybrid' && (
                            <p className="text-xs text-zinc-500">
                              AI: {entry.llm_score} | Human: {entry.manual_score}
                            </p>
                          )}
                          {/* Score progress bar */}
                          <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                entry.score >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                entry.score >= 70 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                entry.score >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                'bg-gradient-to-r from-zinc-500 to-zinc-600'
                              }`}
                              style={{ width: `${entry.score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button asChild variant="outline" size="sm">
                            <a href={`/submissions/${entry.submission_id}`}>
                              View Project
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href={entry.repo_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Repo
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => (
          <Card
            key={entry.submission_id}
            className={`p-4 transition-all duration-300 ${
              entry.is_user_submission ? 'ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-900/20' : ''
            } ${
              entry.is_new ? 'animate-pulse bg-green-50 dark:bg-green-900/20' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                {getRankIcon(entry.rank)}
                {entry.is_user_submission && (
                  <Badge variant="secondary" className="text-xs">You</Badge>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {entry.avatar_url ? (
                    <a href={`/users/${entry.id}`} className="hover:opacity-80 transition-opacity">
                      <Image
                        src={entry.avatar_url}
                        alt={entry.username}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </a>
                  ) : (
                    <a href={`/users/${entry.id}`} className="hover:opacity-80 transition-opacity">
                      <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-zinc-600">
                          {entry.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </a>
                  )}
                  <div>
                    <a 
                      href={`/users/${entry.id}`}
                      className="font-semibold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {entry.username}
                    </a>
                    <p className="text-xs text-zinc-500">
                      {new Date(entry.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${
                  entry.score >= 90 ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' :
                  entry.score >= 70 ? 'text-blue-600' :
                  entry.score >= 50 ? 'text-amber-600' :
                  'text-zinc-600'
                }`}>
                  {entry.score}
                </div>
                {getScoreBadge(entry.score_type)}
                {entry.score_type === 'hybrid' && (
                  <p className="text-xs text-zinc-500 mt-1">
                    AI: {entry.llm_score}<br/>Human: {entry.manual_score}
                  </p>
                )}
                {/* Score progress bar for mobile */}
                <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-2 ml-auto">
                  <div 
                    className={`h-full ${
                      entry.score >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      entry.score >= 70 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      entry.score >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                      'bg-gradient-to-r from-zinc-500 to-zinc-600'
                    }`}
                    style={{ width: `${entry.score}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href={`/submissions/${entry.submission_id}`}>
                  View Project
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={entry.repo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Repo
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
