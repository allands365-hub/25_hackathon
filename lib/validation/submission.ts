import { z } from 'zod';

// GitHub URL validation - must match pattern: https://github.com/user/repo
export const githubUrlSchema = z
  .string()
  .min(1, 'GitHub repository URL is required')
  .regex(
    /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/,
    'Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)'
  );

// Deck URL validation - must be valid HTTPS URL
export const deckUrlSchema = z
  .string()
  .min(1, 'Pitch deck URL is required')
  .url('Please enter a valid URL')
  .refine(
    (url) => url.startsWith('https://'),
    'URL must use HTTPS'
  );

// Video URL validation - must be valid HTTPS URL (YouTube/Loom/Vimeo)
export const videoUrlSchema = z
  .string()
  .min(1, 'Demo video URL is required')
  .url('Please enter a valid URL')
  .refine(
    (url) => url.startsWith('https://'),
    'URL must use HTTPS'
  )
  .refine(
    (url) => {
      const validDomains = ['youtube.com', 'youtu.be', 'loom.com', 'vimeo.com'];
      return validDomains.some(domain => url.includes(domain));
    },
    'Please use YouTube, Loom, or Vimeo for your demo video'
  );

// Summary validation - 50-500 characters
export const summarySchema = z
  .string()
  .min(50, 'Summary must be at least 50 characters')
  .max(500, 'Summary must be no more than 500 characters');

// Complete submission schema
export const submissionSchema = z.object({
  repoUrl: githubUrlSchema,
  deckUrl: deckUrlSchema,
  videoUrl: videoUrlSchema,
  summary: summarySchema,
});

// Step-specific schemas for progressive validation
export const step1Schema = z.object({
  challengeId: z.string().min(1, 'Challenge selection is required'),
});

export const step2Schema = z.object({
  repoUrl: githubUrlSchema,
  deckUrl: deckUrlSchema,
  videoUrl: videoUrlSchema,
});

export const step3Schema = z.object({
  summary: summarySchema,
});

export const step4Schema = submissionSchema;

export type SubmissionFormData = z.infer<typeof submissionSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
