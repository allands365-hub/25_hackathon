'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/hooks';
import { Avatar } from '@/components/ui/avatar';

// Hardcoded career leaderboard data for MVP
const HARDCODED_LEADERBOARD = [
  {
    rank: 1,
    username: 'alex-coder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    careerScore: 2845,
    totalSubmissions: 12,
    avgScore: 87,
    recentChallenges: ['AI Customer Support Bot', 'Personal AI Tutor', 'Meeting Summarizer'],
    badges: ['🏆 Top 3 Wins', '💻 10+ Submissions', '⭐ Perfect Score'],
  },
  {
    rank: 2,
    username: 'sarah-ai-builder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    careerScore: 2720,
    totalSubmissions: 10,
    avgScore: 84,
    recentChallenges: ['Smart Document Q&A', 'AI Code Review', 'Customer Support Bot'],
    badges: ['🥈 Runner Up', '💡 Innovation Leader', '⭐ High Scorer'],
  },
  {
    rank: 3,
    username: 'tech-master',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    careerScore: 2680,
    totalSubmissions: 11,
    avgScore: 83,
    recentChallenges: ['AI Learning Tutor', 'Customer Support Bot', 'Meeting Summarizer'],
    badges: ['🥉 Podium Finisher', '🚀 Fast Builder', '💻 Pro Coder'],
  },
  {
    rank: 4,
    username: 'ml-innovator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ml',
    careerScore: 2450,
    totalSubmissions: 9,
    avgScore: 81,
    recentChallenges: ['Document Q&A', 'Personal Tutor', 'Code Review'],
    badges: ['💡 Innovation Expert', '🎯 Consistent Scorer', '⭐ Quality Builder'],
  },
  {
    rank: 5,
    username: 'data-scientist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data',
    careerScore: 2380,
    totalSubmissions: 8,
    avgScore: 79,
    recentChallenges: ['AI Tutor', 'Customer Support', 'Meeting AI'],
    badges: ['📊 Data Expert', '⚡ Quick Learner', '🎖️ Active Builder'],
  },
  {
    rank: 6,
    username: 'ai-explorer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer',
    careerScore: 2240,
    totalSubmissions: 7,
    avgScore: 78,
    recentChallenges: ['Code Review Bot', 'Learning Tutor', 'Support Chatbot'],
    badges: ['🔍 Explorer Badge', '🌟 Rising Star', '💎 Quality Contributor'],
  },
  {
    rank: 7,
    username: 'code-genius',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=genius',
    careerScore: 2180,
    totalSubmissions: 8,
    avgScore: 77,
    recentChallenges: ['AI Support Bot', 'Smart Tutor', 'Document Q&A'],
    badges: ['🧠 Smart Coder', '🎯 Problem Solver', '⚡ Active Member'],
  },
  {
    rank: 8,
    username: 'build-champion',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=champion',
    careerScore: 2090,
    totalSubmissions: 6,
    avgScore: 76,
    recentChallenges: ['Personal Tutor', 'Support Bot', 'Meeting AI'],
    badges: ['🏅 Champion', '💪 Strong Builder', '⭐ Notable Contributor'],
  },
  {
    rank: 9,
    username: 'llm-wizard',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wizard',
    careerScore: 1950,
    totalSubmissions: 7,
    avgScore: 74,
    recentChallenges: ['Code Review', 'AI Tutor', 'Support Chatbot'],
    badges: ['🧙 LLM Master', '🎨 Creative Builder', '🚀 Emerging Talent'],
  },
  {
    rank: 10,
    username: 'future-ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=future',
    careerScore: 1820,
    totalSubmissions: 5,
    avgScore: 73,
    recentChallenges: ['AI Learning Tutor', 'Customer Bot', 'Smart Assistant'],
    badges: ['🔮 Future Builder', '✨ Bright Star', '🎖️ Dedicated Contributor'],
  },
];

export default function LeaderboardPage() {
  const { isSponsor, profile } = useAuth();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-zinc-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return <span className="text-zinc-500 font-bold">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Global Career Leaderboard</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Top AI builders ranked by Career Score across all challenges
          </p>
        </div>

        {/* Career Score Explanation */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Trophy className="h-5 w-5" />
              How Career Score Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300">
              <strong>Career Score</strong> is your cumulative performance across all challenges in the current season. 
              Earn points based on your final scores, and climb the leaderboard to become the top AI builder.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-sm">
                <strong className="text-blue-700 dark:text-blue-300">Score Calculation:</strong>
                <p className="text-zinc-600 dark:text-zinc-400">Final Score = 50% LLM + 50% Human Review (when applicable)</p>
              </div>
              <div className="text-sm">
                <strong className="text-blue-700 dark:text-blue-300">Season Format:</strong>
                <p className="text-zinc-600 dark:text-zinc-400">Scores reset quarterly. Top performers earn badges and recognition.</p>
              </div>
              <div className="text-sm">
                <strong className="text-blue-700 dark:text-blue-300">Benefits:</strong>
                <p className="text-zinc-600 dark:text-zinc-400">Higher rankings increase visibility to sponsors and employers.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Top 10 Builders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {HARDCODED_LEADERBOARD.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    profile?.username === entry.username
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-bold text-lg">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar
                    src={entry.avatar}
                    alt={entry.username}
                    size="md"
                  />

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {entry.username}
                      </h3>
                      {profile?.username === entry.username && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {entry.badges.map((badge, idx) => (
                        <span key={idx} className="text-zinc-600 dark:text-zinc-400">{badge}</span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{entry.careerScore}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Career Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{entry.avgScore}%</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{entry.totalSubmissions}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Submissions</div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden flex flex-col gap-1 text-right">
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{entry.careerScore}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{entry.totalSubmissions} submissions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href={isSponsor ? "/sponsor" : "/challenges"} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {isSponsor ? "Sponsor Dashboard" : "Challenges"}
            </Link>
          </Button>
        </div>

        {/* Note */}
        <div className="text-center mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          <p>✨ This is a hardcoded preview. Real leaderboard coming soon with live data!</p>
        </div>
      </div>
    </div>
  );
}
