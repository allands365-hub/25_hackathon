'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ManualScoreFormProps {
  submissionId: string;
  challengeId: string;
  rubric: {
    criteria: Array<{
      name: string;
      weight: number;
      description: string;
    }>;
  };
  existingReview?: {
    score: number;
    criterion_scores: Record<string, number>;
    feedback: string;
  };
  onSuccess?: () => void;
}

export function ManualScoreForm({
  submissionId,
  challengeId,
  rubric,
  existingReview,
  onSuccess,
}: ManualScoreFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>(
    existingReview?.criterion_scores || {}
  );
  const [feedback, setFeedback] = useState(existingReview?.feedback || '');

  // Calculate weighted score
  const calculateFinalScore = () => {
    let totalScore = 0;
    rubric.criteria.forEach((criterion) => {
      const score = criterionScores[criterion.name] || 0;
      totalScore += (score * criterion.weight) / 100;
    });
    return Math.round(totalScore);
  };

  const finalScore = calculateFinalScore();

  // Check if all criteria are scored
  const allScored = rubric.criteria.every(
    (criterion) => criterionScores[criterion.name] !== undefined
  );

  const handleScoreChange = (criterionName: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    setCriterionScores((prev) => ({
      ...prev,
      [criterionName]: clampedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allScored) {
      toast.error('Please score all criteria before submitting');
      return;
    }

    if (!feedback.trim() || feedback.trim().length < 50) {
      toast.error('Feedback must be at least 50 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        submission_id: submissionId,
        criterion_scores: criterionScores,
        feedback: feedback.trim(),
      };

      const response = await fetch('/api/manual-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/sponsor/challenges/${challengeId}`);
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Score Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-900 dark:text-purple-100 mb-1">
                Calculated Manual Score
              </p>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-bold ${getScoreColor(finalScore)}`}>
                  {finalScore}
                </span>
                <span className="text-2xl text-zinc-500">/100</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-900 dark:text-purple-100 mb-2">Scoring Status</p>
              {allScored ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  All Criteria Scored
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {rubric.criteria.length - Object.keys(criterionScores).length} Remaining
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criterion Scoring */}
      <Card>
        <CardHeader>
          <CardTitle>Score Each Criterion</CardTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Rate each criterion from 0-100. Your scores will be weighted automatically.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {rubric.criteria.map((criterion, index) => {
            const score = criterionScores[criterion.name] || 0;
            const contributionToTotal = Math.round((score * criterion.weight) / 100);

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label className="text-base font-semibold">{criterion.name}</Label>
                      <Badge variant="outline">{criterion.weight}% weight</Badge>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {criterion.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Score Input */}
                  <div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => handleScoreChange(criterion.name, e.target.value)}
                        className="w-24 px-3 py-2 text-lg font-semibold text-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        placeholder="0"
                      />
                      <span className="text-zinc-500">/100</span>
                    </div>
                  </div>

                  {/* Visual Feedback */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-zinc-600">Contribution to total:</span>
                      <Badge className={getScoreBadge(score)}>+{contributionToTotal} points</Badge>
                    </div>
                    {/* Score Bar */}
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          score >= 80
                            ? 'bg-green-600'
                            : score >= 60
                            ? 'bg-blue-600'
                            : score >= 40
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Written Feedback</CardTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Provide constructive feedback explaining your scores (minimum 50 characters)
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Explain your evaluation, highlight strengths and areas for improvement..."
            className="min-h-[200px]"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-zinc-500">
              {feedback.length} characters {feedback.length < 50 ? `(${50 - feedback.length} more needed)` : '✓'}
            </p>
            {feedback.length >= 50 && (
              <Badge variant="default">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!allScored || feedback.length < 50 || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting Review...' : existingReview ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>

      {/* Validation Messages */}
      {!allScored && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-900 dark:text-amber-100">
            Please score all {rubric.criteria.length} criteria before submitting
          </p>
        </div>
      )}
    </form>
  );
}
