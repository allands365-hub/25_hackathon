'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { 
  ExternalLink, 
  Github, 
  Trophy, 
  Star, 
  Award, 
  Calendar,
  Target,
  ArrowRight,
  User,
  Code,
  Zap
} from 'lucide-react';

interface Submission {
  id: string;
  challenge_id: string;
  repo_url: string;
  deck_url: string;
  video_url: string;
  summary: string;
  status: 'pending' | 'evaluating' | 'scored';
  created_at: string;
  challenge: {
    title: string;
    difficulty: string;
  };
  evaluation?: {
    score: number;
    rank?: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth();
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      fetchSubmissions(profile.id);
    }
  }, [profile]);

  const fetchSubmissions = async (userId: string) => {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        challenge:challenges(title, difficulty),
        evaluation:evaluations(score)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
    } else {
      setSubmissions(data as any);
      calculateBadges(data as any);
    }
  };

  const calculateBadges = (submissions: Submission[]) => {
    const earnedBadges: Badge[] = [
      {
        id: 'first-submission',
        name: 'First Submission',
        description: 'Submitted your first project',
        icon: <Target className="h-4 w-4" />,
        color: 'bg-blue-500',
        earned: submissions.length > 0
      },
      {
        id: 'top-10-percent',
        name: 'Top 10%',
        description: 'Achieved a score in the top 10%',
        icon: <Star className="h-4 w-4" />,
        color: 'bg-yellow-500',
        earned: submissions.some(s => s.evaluation && s.evaluation.score >= 90)
      },
      {
        id: 'challenge-winner',
        name: 'Challenge Winner',
        description: 'Won first place in a challenge',
        icon: <Trophy className="h-4 w-4" />,
        color: 'bg-purple-500',
        earned: submissions.some(s => s.evaluation && s.evaluation.rank === 1)
      },
      {
        id: 'high-scorer',
        name: 'High Scorer',
        description: 'Achieved a score above 80',
        icon: <Award className="h-4 w-4" />,
        color: 'bg-green-500',
        earned: submissions.some(s => s.evaluation && s.evaluation.score >= 80)
      },
      {
        id: 'prolific-builder',
        name: 'Prolific Builder',
        description: 'Submitted 5 or more projects',
        icon: <Code className="h-4 w-4" />,
        color: 'bg-orange-500',
        earned: submissions.length >= 5
      }
    ];

    setBadges(earnedBadges);
  };

  const handleUpdateBio = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ bio })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Badges */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {profile.avatar_url && (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.username}
                      width={120}
                      height={120}
                      className="rounded-full mx-auto"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold">{profile.username}</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">{profile.email}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Github className="h-4 w-4" />
                      <a
                        href={`https://github.com/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        GitHub Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Member since {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateBio} disabled={isSaving} size="sm">
                    {isSaving ? 'Saving...' : 'Update Bio'}
                  </Button>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        badge.earned 
                          ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' 
                          : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 opacity-60'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${badge.color} ${badge.earned ? '' : 'opacity-50'}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${badge.earned ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>
                          {badge.name}
                        </h4>
                        <p className="text-sm text-zinc-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Submissions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Submissions</h2>
              <Badge variant="outline" className="text-sm">
                {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
              </Badge>
            </div>

            {submissions.length === 0 ? (
              /* Empty State */
              <Card className="p-12 text-center">
                <div className="space-y-6">
                  <div className="mx-auto w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <Zap className="h-12 w-12 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                      Start building AI products and showcase your skills to the world!
                    </p>
                    <Button asChild size="lg">
                      <a href="/challenges">
                        Browse Challenges
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              /* Submissions List */
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{submission.challenge.title}</h3>
                            <Badge 
                              variant={submission.challenge.difficulty === 'Beginner' ? 'default' : 
                                      submission.challenge.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                            >
                              {submission.challenge.difficulty}
                            </Badge>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                            {submission.summary}
                          </p>
                          <div className="flex gap-4 text-sm text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                            <span className={`flex items-center gap-1 ${
                              submission.status === 'scored' ? 'text-green-600' :
                              submission.status === 'evaluating' ? 'text-blue-600' :
                              'text-amber-600'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                submission.status === 'scored' ? 'bg-green-500' :
                                submission.status === 'evaluating' ? 'bg-blue-500 animate-pulse' :
                                'bg-amber-500'
                              }`} />
                              {submission.status === 'scored' ? 'Evaluated' :
                               submission.status === 'evaluating' ? 'Evaluating...' :
                               'Pending'}
                            </span>
                          </div>
                        </div>
                        {submission.evaluation && (
                          <div className="text-right ml-4">
                            <div className="text-3xl font-bold text-blue-600">
                              {submission.evaluation.score}
                            </div>
                            <p className="text-sm text-zinc-600">Score</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Button asChild variant="outline" size="sm">
                          <a href={`/submissions/${submission.id}`}>
                            View Details
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a href={submission.repo_url} target="_blank" rel="noopener noreferrer">
                            <Github className="h-3 w-3 mr-1" />
                            Repo
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a href={`/challenges/${submission.challenge_id}`}>
                            Challenge
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
