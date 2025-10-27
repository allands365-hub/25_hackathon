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
  Linkedin,
  Trophy, 
  Star, 
  Award, 
  Calendar,
  Target,
  ArrowRight,
  User,
  Code,
  Zap,
  MapPin,
  Briefcase,
  FileText,
  Globe,
  Twitter,
  Plus,
  X
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
  const { user, profile, isLoading, isAuthenticated, signOut, isSponsor } = useAuth();
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'busy' | 'not_looking'>('available');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
    
    // Redirect sponsors to their profile page
    if (!isLoading && isAuthenticated && isSponsor) {
      router.push('/sponsor/profile');
    }
  }, [isLoading, isAuthenticated, router, isSponsor]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setLinkedinUrl((profile as any).linkedin_url || '');
      setPortfolioUrl((profile as any).portfolio_url || '');
      setCvUrl((profile as any).cv_url || '');
      setLocation((profile as any).location || '');
      setWebsiteUrl((profile as any).website_url || '');
      setTwitterUrl((profile as any).twitter_url || '');
      setExperienceYears((profile as any).experience_years || 0);
      setAvailabilityStatus((profile as any).availability_status || 'available');
      setSkills((profile as any).skills || []);
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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const calculateBadges = (submissions: Submission[]) => {
    const earnedBadges: Badge[] = [
      {
        id: 'first-submission',
        name: 'First Submission',
        description: 'Submitted your first project',
        icon: <Target className="h-4 w-4" />,
        color: 'bg-primary/100',
        earned: submissions.length > 0
      },
      {
        id: 'top-10-percent',
        name: 'Top 10%',
        description: 'Achieved a score in the top 10%',
        icon: <Star className="h-4 w-4" />,
        color: 'bg-[color:var(--warning)]/100',
        earned: submissions.some(s => s.evaluation && s.evaluation.score >= 90)
      },
      {
        id: 'challenge-winner',
        name: 'Challenge Winner',
        description: 'Won first place in a challenge',
        icon: <Trophy className="h-4 w-4" />,
        color: 'bg-accent0',
        earned: submissions.some(s => s.evaluation && s.evaluation.rank === 1)
      },
      {
        id: 'high-scorer',
        name: 'High Scorer',
        description: 'Achieved a score above 80',
        icon: <Award className="h-4 w-4" />,
        color: 'bg-[color:var(--success)]/100',
        earned: submissions.some(s => s.evaluation && s.evaluation.score >= 80)
      },
      {
        id: 'prolific-builder',
        name: 'Prolific Builder',
        description: 'Submitted 5 or more projects',
        icon: <Code className="h-4 w-4" />,
        color: 'bg-[color:var(--chart-3)]',
        earned: submissions.length >= 5
      }
    ];

    setBadges(earnedBadges);
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          bio,
          linkedin_url: linkedinUrl || null,
          portfolio_url: portfolioUrl || null,
          cv_url: cvUrl || null,
          location: location || null,
          website_url: websiteUrl || null,
          twitter_url: twitterUrl || null,
          experience_years: experienceYears,
          availability_status: availabilityStatus,
          skills: skills.length > 0 ? skills : null
        })
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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <a
                        href={`https://github.com/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        <Github className="h-4 w-4" />
                        GitHub Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {linkedinUrl && (
                        <a
                          href={linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {portfolioUrl && (
                        <a
                          href={portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          <Globe className="h-4 w-4" />
                          Portfolio
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {cvUrl && (
                        <a
                          href={cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          CV
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
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
                
                {/* LinkedIn Profile Link */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    LinkedIn Profile URL
                  </label>
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    type="url"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your LinkedIn profile to help sponsors discover you
                  </p>
                </div>

                {/* Portfolio Website */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Portfolio Website URL
                  </label>
                  <Input
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    type="url"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to your portfolio, GitHub Pages, or personal website
                  </p>
                </div>

                {/* CV/Resume */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    CV/Resume URL
                  </label>
                  <Input
                    value={cvUrl}
                    onChange={(e) => setCvUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/your-cv"
                    type="url"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to your CV (Google Drive, Dropbox, or personal website)
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full"
                  />
                </div>

                {/* Personal Website */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Personal Website
                  </label>
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourname.com"
                    type="url"
                    className="w-full"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Twitter/X Profile
                  </label>
                  <Input
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    type="url"
                    className="w-full"
                  />
                </div>

                {/* Experience Years */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Years of Experience
                  </label>
                  <Input
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                    placeholder="5"
                    type="number"
                    min="0"
                    className="w-full"
                  />
                </div>

                {/* Availability Status */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Availability Status
                  </label>
                  <select
                    value={availabilityStatus}
                    onChange={(e) => setAvailabilityStatus(e.target.value as 'available' | 'busy' | 'not_looking')}
                    className="w-full p-2 border border-border rounded-md bg-white"
                  >
                    <option value="available">Available for opportunities</option>
                    <option value="busy">Busy but open to opportunities</option>
                    <option value="not_looking">Not currently looking</option>
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Skills & Technologies
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., React, Python, AI)"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your technical skills and technologies
                  </p>
                </div>

                <Button onClick={handleUpdateProfile} disabled={isSaving} size="sm" className="w-full">
                  {isSaving ? 'Saving...' : 'Update Profile'}
                </Button>
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
                          ? 'bg-secondary border-border' 
                          : 'bg-background border-border opacity-60'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${badge.color} ${badge.earned ? '' : 'opacity-50'}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {badge.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
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
              /* Empty State - Enhanced */
              <Card className="p-12 text-center hover-lift">
                <div className="space-y-6">
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                    <Zap className="h-16 w-16 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Ready to Make Your Mark?
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Start building AI products and showcase your skills to the world! Submit your first project and climb the leaderboard.
                    </p>
                    <Button asChild size="lg" className="transition-all hover:scale-105">
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
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {submission.summary}
                          </p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                            <span className={`flex items-center gap-1 ${
                              submission.status === 'scored' ? 'text-[color:var(--success)]' :
                              submission.status === 'evaluating' ? 'text-primary' :
                              'text-[color:var(--warning)]'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                submission.status === 'scored' ? 'bg-[color:var(--success)]/100' :
                                submission.status === 'evaluating' ? 'bg-primary/100 animate-pulse' :
                                'bg-[color:var(--warning)]/100'
                              }`} />
                              {submission.status === 'scored' ? 'Evaluated' :
                               submission.status === 'evaluating' ? 'Evaluating...' :
                               'Pending'}
                            </span>
                          </div>
                        </div>
                        {submission.evaluation && (
                          <div className="text-right ml-4">
                            <div className="text-3xl font-bold text-primary">
                              {submission.evaluation.score}
                            </div>
                            <p className="text-sm text-muted-foreground">Score</p>
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
