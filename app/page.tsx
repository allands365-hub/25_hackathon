import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Code, Trophy, Users, Calendar, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              <span className="block">Prove Your AI Skills.</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get Hired.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-zinc-600 dark:text-zinc-400">
              The competitive arena where AI builders submit projects to real challenges,
              get evaluated by LLMs in seconds, and rise on the leaderboard to catch the
              attention of top companies.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/challenges">Browse Challenges</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/signin">Sign In with GitHub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Target className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Choose a Challenge</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Browse real-world AI product challenges posted by companies looking for talent.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Code className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Build & Submit Your Project</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Create your solution, push to GitHub, and submit with a pitch deck and demo video.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Get Evaluated & Ranked</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Receive instant AI-powered evaluation and compete for the top spot on the leaderboard.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Challenges</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Intermediate</Badge>
                  <span className="text-sm text-zinc-500">Deadline: 11/24/2025</span>
                </div>
                <CardTitle className="text-xl">Personal AI Learning Tutor</CardTitle>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Sponsored by EduTech Solutions</p>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                  Design an adaptive learning assistant that helps users master new topics through personalized lessons and quizzes.
                </p>
                <Button asChild className="w-full">
                  <Link href="/challenges/fdfcfae1-4da6-421a-94ed-ebfbb85f9269">View Challenge</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="default">Beginner</Badge>
                  <span className="text-sm text-zinc-500">Deadline: 12/15/2025</span>
                </div>
                <CardTitle className="text-xl">AI Meeting Summarizer</CardTitle>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Sponsored by TechCorp</p>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                  Build an AI-powered tool that automatically transcribes and summarizes meeting recordings with action items.
                </p>
                <Button asChild className="w-full">
                  <Link href="/challenges/16d34754-9ff7-4633-a29e-43a34b7738a3">View Challenge</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="destructive">Advanced</Badge>
                  <span className="text-sm text-zinc-500">Deadline: 12/01/2025</span>
                </div>
                <CardTitle className="text-xl">AI-Powered Customer Support Bot</CardTitle>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Sponsored by StartupXYZ</p>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                  Create an intelligent customer support bot that can handle complex queries and escalate to humans when needed.
                </p>
                <Button asChild className="w-full">
                  <Link href="/challenges/0081f314-44de-4e7f-9638-bd0c12f10712">View Challenge</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-blue-600">1,247</div>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">Builders</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-600">89</div>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">Challenges</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-pink-600">342</div>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">Projects Evaluated</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Showcase Your AI Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join BuildAI Arena today and start competing on real AI product challenges.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/challenges">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">BuildAI Arena</h3>
              <p className="text-zinc-400 mb-4">
                The competitive arena where AI builders prove their skills and get hired by top companies.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                  <Users className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/challenges" className="text-zinc-400 hover:text-white transition-colors">
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                    GitHub Repo
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
            <p className="text-zinc-400">
              © 2025 BuildAI Arena. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
