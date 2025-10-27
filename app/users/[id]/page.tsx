'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { 
  Github, 
  Linkedin, 
  ExternalLink, 
  Trophy, 
  Star, 
  Award,
  Calendar,
  MapPin,
  Code,
  TrendingUp,
  Eye,
  FileText,
  Globe,
  Twitter,
  Briefcase
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  cv_url: string | null;
  skills: string[] | null;
  location: string | null;
  website_url: string | null;
  twitter_url: string | null;
  experience_years: number;
  availability_status: string;
  created_at: string;
  role: string;
  company_name: string | null;
}

interface Submission {
  id: string;
  challenge_id: string;
  repo_url: string;
  summary: string;
  created_at: string;
  challenge: {
    title: string;
    difficulty: string;
    sponsor_name: string;
  };
  evaluation?: {
    score: number;
    rank?: number;
  };
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Build GitHub URL from username
      if (userData && !userData.github_url) {
        userData.github_url = `https://github.com/${userData.username}`;
      }

      setProfile(userData);

      // Fetch submissions for this user
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          challenge:challenges(title, difficulty, sponsor_name),
          evaluation:evaluations(score)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData as any);

      // Calculate stats
      if (submissionsData) {
        const totalSubmissions = submissionsData.length;
        const averageScore = submissionsData
          .filter(s => s.evaluation)
          .reduce((acc, s) => acc + (s.evaluation?.score || 0), 0) / 
          submissionsData.filter(s => s.evaluation).length;
      }

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full p-8">
          <div className="text-center space-y-4">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="text-muted-foreground">
              This profile doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/challenges')}
              className="text-primary hover:underline"
            >
              Return to Challenges
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const isSponsor = profile.role === 'sponsor';
  const totalSubmissions = submissions.length;
  const averageScore = submissions
    .filter(s => s.evaluation)
    .reduce((acc, s) => acc + (s.evaluation?.score || 0), 0) / 
    Math.max(submissions.filter(s => s.evaluation).length, 1);
  const highestScore = Math.max(...submissions.map(s => s.evaluation?.score || 0), 0);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.username}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-4xl font-bold text-muted-foreground">
                      {profile.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
                    {profile.company_name && (
                      <p className="text-lg text-muted-foreground">
                        {profile.company_name}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={isSponsor ? 'default' : 'secondary'}>
                        {isSponsor ? 'Sponsor' : 'Builder'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Portfolio</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.cv_url && (
                    <a
                      href={profile.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileText className="h-5 w-5" />
                      <span>CV</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                      <span>Twitter</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-primary">{totalSubmissions}</div>
                    <div className="text-sm text-muted-foreground">Submissions</div>
                  </div>
                  {averageScore > 0 && (
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-[color:var(--success)]">{Math.round(averageScore)}</div>
                      <div className="text-sm text-muted-foreground">Avg Score</div>
                    </div>
                  )}
                  {highestScore > 0 && (
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-accent-foreground">{highestScore}</div>
                      <div className="text-sm text-muted-foreground">Best Score</div>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mt-4 p-4 bg-background rounded-lg">
                    <p className="text-foreground">{profile.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Skills & Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.experience_years > 0 && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.experience_years} years experience</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  {profile.availability_status && (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        profile.availability_status === 'available' ? 'bg-[color:var(--success)]/100' :
                        profile.availability_status === 'busy' ? 'bg-[color:var(--warning)]/100' :
                        'bg-destructive/100'
                      }`} />
                      <span className="capitalize">{profile.availability_status.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
          {submissions.length === 0 ? (
            <Card className="p-12 text-center">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground">
                This user hasn't submitted any projects yet.
              </p>
            </Card>
          ) : (
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
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {submission.summary}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {submission.challenge.sponsor_name}
                          </span>
                        </div>
                      </div>
                      {submission.evaluation && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">
                            {submission.evaluation.score}
                          </div>
                          <p className="text-sm text-muted-foreground">Score</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={submission.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Github className="h-4 w-4" />
                        View Repository
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

