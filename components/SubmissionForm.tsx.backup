'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CharacterCounter } from '@/components/ui/character-counter';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  submissionSchema, 
  step1Schema, 
  step2Schema, 
  step3Schema, 
  step4Schema,
  type SubmissionFormData,
  type Step1Data,
  type Step2Data,
  type Step3Data,
  type Step4Data
} from '@/lib/validation/submission';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/hooks';
import { CheckCircle, ExternalLink, Github, FileText, Video, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  deadline: string;
  sponsor_name: string;
}

interface SubmissionFormProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = [
  { id: 1, title: 'Challenge', description: 'Confirm selection' },
  { id: 2, title: 'Project Links', description: 'Add your URLs' },
  { id: 3, title: 'Summary', description: 'Describe your project' },
  { id: 4, title: 'Review', description: 'Submit for evaluation' },
];

export function SubmissionForm({ challenge, isOpen, onClose, onSuccess }: SubmissionFormProps) {
  const router = useRouter();
  const { isAuthenticated, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<SubmissionFormData>>({});

  // If user is not authenticated and tries to open the form, redirect to sign in
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      onClose();
      toast.error('Please sign in to submit a project');
      router.push('/auth/signin');
    }
  }, [isOpen, isAuthenticated, onClose, router]);

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    mode: 'onChange',
    defaultValues: {
      repoUrl: '',
      deckUrl: '',
      videoUrl: '',
      summary: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, trigger } = form;
  const watchedValues = watch();

  const handleNext = async () => {
    let isValidStep = false;

    switch (currentStep) {
      case 1:
        isValidStep = true; // No validation needed for step 1
        break;
      case 2:
        isValidStep = await trigger(['repoUrl', 'deckUrl', 'videoUrl']);
        break;
      case 3:
        isValidStep = await trigger('summary');
        break;
      case 4:
        // Final validation before submission
        isValidStep = await trigger();
        break;
    }

    if (isValidStep) {
      // Save current step data
      setFormData(prev => ({ ...prev, ...watchedValues }));
      
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Submit the form
        await handleFormSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    if (!isAuthenticated || !profile) {
      toast.error('Please sign in to submit');
      router.push('/auth/signin');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submissionData = {
        challenge_id: challenge.id,
        user_id: profile.id,
        repo_url: watchedValues.repoUrl,
        deck_url: watchedValues.deckUrl,
        video_url: watchedValues.videoUrl,
        summary: watchedValues.summary,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        throw error;
      }

             // Trigger evaluation
             const response = await fetch('/api/evaluate', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({ submissionId: data.id }),
             });

             if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               
               if (response.status === 429) {
                 toast.error(errorData.error || 'Evaluation queue is full. Your submission will be processed shortly.');
               } else if (response.status === 503) {
                 toast.error(errorData.error || 'Evaluation service temporarily unavailable. Please try again later.');
               } else {
                 toast.error(errorData.error || 'Failed to trigger evaluation. Please try again.');
               }
               
               // Don't throw error for rate limiting - submission was successful
               if (response.status !== 429) {
                 throw new Error('Failed to trigger evaluation');
               }
             }

      toast.success('Project submitted successfully! Evaluation in progress...');
      onSuccess();
      onClose();
      
      // Redirect to submission detail page
      router.push(`/submissions/${data.id}`);
      
      // Reset form
      setCurrentStep(1);
      setFormData({});
      form.reset();

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Challenge Selection</h3>
              <p className="text-muted-foreground">Review the challenge you're submitting to</p>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <Badge variant={challenge.difficulty === 'Beginner' ? 'default' : challenge.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Sponsored by {challenge.sponsor_name}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{challenge.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Project Links</h3>
              <p className="text-muted-foreground">Provide links to your project resources</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Github className="h-4 w-4" />
                  GitHub Repository URL *
                </label>
                <div className="relative">
                  <Input
                    {...register('repoUrl')}
                    placeholder="https://github.com/username/project"
                    className={errors.repoUrl ? 'border-red-500 pr-10' : ''}
                    data-testid="repo-url-input"
                  />
                  {errors.repoUrl && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                {errors.repoUrl && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.repoUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText className="h-4 w-4" />
                  Pitch Deck URL *
                </label>
                <div className="relative">
                  <Input
                    {...register('deckUrl')}
                    placeholder="https://docs.google.com/presentation/..."
                    className={errors.deckUrl ? 'border-red-500 pr-10' : ''}
                    data-testid="deck-url-input"
                  />
                  {errors.deckUrl && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                {errors.deckUrl && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.deckUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Video className="h-4 w-4" />
                  Demo Video URL *
                </label>
                <div className="relative">
                  <Input
                    {...register('videoUrl')}
                    placeholder="https://youtube.com/watch?v=..."
                    className={errors.videoUrl ? 'border-red-500 pr-10' : ''}
                    data-testid="video-url-input"
                  />
                  {errors.videoUrl && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                {errors.videoUrl && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.videoUrl.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Use YouTube, Loom, or Vimeo
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
              <p className="text-muted-foreground">Describe your project and how it solves the challenge</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Summary *
              </label>
                    <div className="relative">
                      <Textarea
                        {...register('summary')}
                        placeholder="Describe your project, key features, and how it solves the problem..."
                        className={`min-h-[120px] ${errors.summary ? 'border-red-500 pr-10' : ''}`}
                        data-testid="summary-textarea"
                      />
                      {errors.summary && (
                        <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <CharacterCounter 
                      current={watchedValues.summary?.length || 0} 
                      max={500} 
                      min={50}
                      className="mt-2"
                    />
                    {errors.summary && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.summary.message}
                      </p>
                    )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
              <p className="text-muted-foreground">Review your submission before sending for evaluation</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Challenge</h4>
                <p className="text-sm text-muted-foreground">{challenge.title}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">GitHub Repository</h4>
                <div className="flex items-center gap-2">
                  <a 
                    href={watchedValues.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    {watchedValues.repoUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Pitch Deck</h4>
                <div className="flex items-center gap-2">
                  <a 
                    href={watchedValues.deckUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    {watchedValues.deckUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Demo Video</h4>
                <div className="flex items-center gap-2">
                  <a 
                    href={watchedValues.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    {watchedValues.videoUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {watchedValues.summary}
                </p>
                <CharacterCounter 
                  current={watchedValues.summary?.length || 0} 
                  max={500} 
                  min={50}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="submission-form-dialog">
            <DialogHeader>
              <DialogTitle data-testid="submission-form-title">Submit to {challenge.title}</DialogTitle>
              <p className="text-sm text-muted-foreground" data-testid="submission-form-description">
                Complete the multi-step form to submit your project for evaluation.
              </p>
            </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6" data-testid="submission-form-steps">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between" data-testid="submission-form-navigation">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
            data-testid="submission-back-btn"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="submission-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2"
              data-testid="submission-next-btn"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : currentStep === 4 ? (
                'Submit Project'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
