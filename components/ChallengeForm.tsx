'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

// Validation schema
const criterionSchema = z.object({
  name: z.string().min(3, 'Criterion name must be at least 3 characters'),
  weight: z.number().min(1).max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const challengeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Deadline must be in the future',
  }),
  problemStatement: z.string().min(100, 'Problem statement must be at least 100 characters'),
  criteria: z.array(criterionSchema).min(3, 'At least 3 evaluation criteria required'),
  prizeAmount: z.number().min(0).optional(),
  prizeCurrency: z.string().default('USD'),
  isPublished: z.boolean().default(false),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ChallengeFormData>;
  challengeId?: string;
  onSuccess?: () => void;
}

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Title, difficulty, deadline' },
  { id: 2, title: 'Problem Statement', description: 'Detailed requirements' },
  { id: 3, title: 'Evaluation Rubric', description: 'Scoring criteria' },
  { id: 4, title: 'Prize & Publishing', description: 'Final settings' },
];

export function ChallengeForm({ mode, initialData, challengeId, onSuccess }: ChallengeFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      difficulty: 'Intermediate',
      deadline: '',
      problemStatement: '',
      criteria: [
        { name: 'Technical Implementation', weight: 30, description: '' },
        { name: 'User Experience', weight: 25, description: '' },
        { name: 'Innovation', weight: 20, description: '' },
        { name: 'Production Readiness', weight: 15, description: '' },
        { name: 'Problem Solving', weight: 10, description: '' },
      ],
      prizeAmount: 0,
      prizeCurrency: 'USD',
      isPublished: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criteria',
  });

  const watchedValues = watch();
  const totalWeight = watchedValues.criteria?.reduce((sum, c) => sum + (c.weight || 0), 0) || 0;

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger(['title', 'description', 'difficulty', 'deadline']);
        break;
      case 2:
        isValid = await trigger('problemStatement');
        break;
      case 3:
        isValid = await trigger('criteria');
        if (isValid && totalWeight !== 100) {
          toast.error('Criterion weights must sum to exactly 100%');
          return;
        }
        break;
      case 4:
        isValid = await trigger();
        break;
    }

    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleFormSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = watchedValues;

      // Format data for API
      const challengeData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        deadline: new Date(formData.deadline).toISOString(),
        problem_statement: formData.problemStatement,
        rubric: {
          criteria: formData.criteria.map((c) => ({
            name: c.name,
            weight: c.weight,
            description: c.description,
          })),
        },
        prize_amount: formData.prizeAmount || 0,
        prize_currency: formData.prizeCurrency,
        is_published: formData.isPublished,
      };

      const endpoint = mode === 'create' ? '/api/challenges' : `/api/challenges/${challengeId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save challenge');
      }

      const result = await response.json();

      toast.success(
        mode === 'create'
          ? 'Challenge created successfully!'
          : 'Challenge updated successfully!'
      );

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/sponsor/challenges');
      }
    } catch (error: any) {
      console.error('Error saving challenge:', error);
      toast.error(error.message || 'Failed to save challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <p className="text-muted-foreground">
                Set up the fundamental details of your challenge
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Challenge Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., AI-Powered Customer Support Bot"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">
                  Short Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Brief overview of what builders will create..."
                  className={`min-h-[80px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">
                    Difficulty Level <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="difficulty"
                    {...register('difficulty')}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {errors.difficulty && (
                    <p className="text-sm text-red-500 mt-1">{errors.difficulty.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="deadline">
                    Deadline <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    {...register('deadline')}
                    className={errors.deadline ? 'border-red-500' : ''}
                  />
                  {errors.deadline && (
                    <p className="text-sm text-red-500 mt-1">{errors.deadline.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Problem Statement</h3>
              <p className="text-muted-foreground">
                Provide detailed requirements and context for builders
              </p>
            </div>

            <div>
              <Label htmlFor="problemStatement">
                Detailed Problem Statement <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="problemStatement"
                {...register('problemStatement')}
                placeholder="Describe the problem in detail. What should builders create? What are the requirements? What makes a successful solution?"
                className={`min-h-[300px] ${errors.problemStatement ? 'border-red-500' : ''}`}
              />
              <p className="text-xs text-zinc-500 mt-1">
                {watchedValues.problemStatement?.length || 0} characters (minimum 100)
              </p>
              {errors.problemStatement && (
                <p className="text-sm text-red-500 mt-1">{errors.problemStatement.message}</p>
              )}
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Tip:</strong> A good problem statement includes:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1 list-disc list-inside">
                  <li>Context and background</li>
                  <li>Specific requirements and constraints</li>
                  <li>Success criteria</li>
                  <li>Expected deliverables</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Evaluation Rubric</h3>
              <p className="text-muted-foreground">
                Define how submissions will be scored (weights must sum to 100%)
              </p>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold">Criterion {index + 1}</h4>
                      {fields.length > 3 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Label>Criterion Name</Label>
                        <Input
                          {...register(`criteria.${index}.name` as const)}
                          placeholder="e.g., Technical Implementation"
                        />
                      </div>
                      <div>
                        <Label>Weight (%)</Label>
                        <Input
                          type="number"
                          {...register(`criteria.${index}.weight` as const, {
                            valueAsNumber: true,
                          })}
                          min="1"
                          max="100"
                        />
                      </div>
                      <div className="flex items-end">
                        <Badge variant={totalWeight === 100 ? 'default' : 'destructive'}>
                          Total: {totalWeight}%
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Label>Description</Label>
                      <Textarea
                        {...register(`criteria.${index}.description` as const)}
                        placeholder="What will be evaluated in this criterion?"
                        className="min-h-[60px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {totalWeight !== 100 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    Weights must sum to exactly 100%. Current total: {totalWeight}%
                  </p>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ name: '', weight: 0, description: '' })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Criterion
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Prize & Publishing</h3>
              <p className="text-muted-foreground">
                Set prize details and decide when to publish
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="prizeAmount">Prize Amount (optional)</Label>
                  <Input
                    id="prizeAmount"
                    type="number"
                    {...register('prizeAmount', { valueAsNumber: true })}
                    placeholder="1000"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="prizeCurrency">Currency</Label>
                  <select
                    id="prizeCurrency"
                    {...register('prizeCurrency')}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <input
                  id="isPublished"
                  type="checkbox"
                  {...register('isPublished')}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="isPublished" className="cursor-pointer">
                    Publish immediately
                  </Label>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    If unchecked, challenge will be saved as draft and can be published later
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Your Challenge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Title:</p>
                    <p className="text-sm text-zinc-600">{watchedValues.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Difficulty:</p>
                    <Badge>{watchedValues.difficulty}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Deadline:</p>
                    <p className="text-sm text-zinc-600">
                      {watchedValues.deadline
                        ? new Date(watchedValues.deadline).toLocaleString()
                        : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Evaluation Criteria:</p>
                    <p className="text-sm text-zinc-600">
                      {watchedValues.criteria?.length || 0} criteria (Total: {totalWeight}%)
                    </p>
                  </div>
                  {watchedValues.prizeAmount && watchedValues.prizeAmount > 0 && (
                    <div>
                      <p className="text-sm font-medium">Prize:</p>
                      <p className="text-sm text-zinc-600">
                        {watchedValues.prizeCurrency} {watchedValues.prizeAmount}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button type="button" onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            'Saving...'
          ) : currentStep === 4 ? (
            mode === 'create' ? (
              'Create Challenge'
            ) : (
              'Update Challenge'
            )
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
