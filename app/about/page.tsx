import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">About BuildAI Arena</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            The future of AI talent discovery
          </p>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            BuildAI Arena bridges the gap between AI builders and companies looking for product-ready talent.
            Traditional hiring can't assess the ability to ship real AI products. We solve this by creating
            a competitive platform where builders demonstrate their skills on real challenges, get evaluated
            by AI in seconds, and rise on leaderboards that companies trust.
          </p>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">The Problem We Solve</h2>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold text-lg mb-2">For AI Builders:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Hard to showcase holistic AI product skills beyond code samples</li>
                <li>Portfolios often lack real-world product challenges</li>
                <li>No objective, instant feedback on AI projects</li>
                <li>Difficult to stand out in the AI talent market</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">For Companies:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Can't verify if candidates can build production-ready AI products</li>
                <li>Resume screening doesn't reveal product thinking</li>
                <li>Need to see end-to-end AI implementation skills</li>
                <li>Want pre-vetted talent with proven abilities</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Real Challenges</h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                Companies post real-world AI product challenges with detailed rubrics. These aren't
                toy problems - they're the kind of work you'd do on the job.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">2. Build & Submit</h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                Builders create solutions using modern AI tools (like Groq, Claude, GPT-4), push code
                to GitHub, and submit with a pitch deck and demo video showing their thought process.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">3. AI-Powered Evaluation</h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                Our Groq-powered LLM evaluates submissions against the challenge rubric in under 30 seconds.
                You get detailed scores on technical implementation, UX, innovation, and more.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">4. Leaderboard & Hiring</h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                Top performers rise on real-time leaderboards. Companies browse leaderboards to find
                talented builders who've proven they can ship AI products.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Why Groq AI?</h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            We use Groq's ultra-fast LLM inference to evaluate submissions in under 30 seconds.
            Traditional code review takes hours or days. With Groq's llama-3.1-70b-versatile model,
            builders get instant, detailed feedback on their projects, enabling rapid iteration and learning.
          </p>
        </Card>

        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-6">
            Whether you're a builder looking to showcase your skills or a company seeking AI talent,
            BuildAI Arena is your platform for demonstrating and discovering product-ready AI expertise.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/challenges">Browse Challenges</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
