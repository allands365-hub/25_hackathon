// Database types for BuildAI Arena
// Auto-generated from Supabase schema

export type UserRole = 'builder' | 'sponsor' | 'admin';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type SubmissionStatus = 'pending' | 'evaluating' | 'evaluated' | 'failed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          github_id: string;
          username: string;
          email: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          company_name: string | null;
          company_logo_url: string | null;
          company_website: string | null;
          company_intro: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          cv_url: string | null;
          skills: string[] | null;
          location: string | null;
          website_url: string | null;
          twitter_url: string | null;
          experience_years: number;
          availability_status: 'available' | 'busy' | 'not_looking';
          created_at: string;
        };
        Insert: {
          id?: string;
          github_id: string;
          username: string;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          company_name?: string | null;
          company_logo_url?: string | null;
          company_website?: string | null;
          company_intro?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          cv_url?: string | null;
          skills?: string[] | null;
          location?: string | null;
          website_url?: string | null;
          twitter_url?: string | null;
          experience_years?: number;
          availability_status?: 'available' | 'busy' | 'not_looking';
          created_at?: string;
        };
        Update: {
          id?: string;
          github_id?: string;
          username?: string;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          company_name?: string | null;
          company_logo_url?: string | null;
          company_website?: string | null;
          company_intro?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          cv_url?: string | null;
          skills?: string[] | null;
          location?: string | null;
          website_url?: string | null;
          twitter_url?: string | null;
          experience_years?: number;
          availability_status?: 'available' | 'busy' | 'not_looking';
          created_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          problem_statement: string;
          rubric: {
            criteria: Array<{
              name: string;
              weight: number;
              description: string;
            }>;
          };
          difficulty: Difficulty;
          deadline: string;
          sponsor_name: string | null;
          sponsor_logo_url: string | null;
          created_by: string | null;
          prize_amount: number;
          prize_currency: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          problem_statement: string;
          rubric: {
            criteria: Array<{
              name: string;
              weight: number;
              description: string;
            }>;
          };
          difficulty: Difficulty;
          deadline: string;
          sponsor_name?: string | null;
          sponsor_logo_url?: string | null;
          created_by?: string | null;
          prize_amount?: number;
          prize_currency?: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          problem_statement?: string;
          rubric?: {
            criteria: Array<{
              name: string;
              weight: number;
              description: string;
            }>;
          };
          difficulty?: Difficulty;
          deadline?: string;
          sponsor_name?: string | null;
          sponsor_logo_url?: string | null;
          created_by?: string | null;
          prize_amount?: number;
          prize_currency?: string;
          is_published?: boolean;
          created_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          repo_url: string;
          deck_url: string | null;
          video_url: string | null;
          summary: string;
          status: SubmissionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          repo_url: string;
          deck_url?: string | null;
          video_url?: string | null;
          summary: string;
          status?: SubmissionStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          repo_url?: string;
          deck_url?: string | null;
          video_url?: string | null;
          summary?: string;
          status?: SubmissionStatus;
          created_at?: string;
        };
      };
      evaluations: {
        Row: {
          id: string;
          submission_id: string;
          score: number;
          criterion_scores: Record<string, number>;
          feedback: string;
          evaluated_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          score: number;
          criterion_scores: Record<string, number>;
          feedback: string;
          evaluated_at?: string;
        };
        Update: {
          id?: string;
          submission_id?: string;
          score?: number;
          criterion_scores?: Record<string, number>;
          feedback?: string;
          evaluated_at?: string;
        };
      };
      manual_reviews: {
        Row: {
          id: string;
          submission_id: string;
          reviewer_id: string;
          score: number;
          criterion_scores: Record<string, number>;
          feedback: string;
          reviewed_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          reviewer_id: string;
          score: number;
          criterion_scores: Record<string, number>;
          feedback: string;
          reviewed_at?: string;
        };
        Update: {
          id?: string;
          submission_id?: string;
          reviewer_id?: string;
          score?: number;
          criterion_scores?: Record<string, number>;
          feedback?: string;
          reviewed_at?: string;
        };
      };
    };
    Views: {
      leaderboard: {
        Row: {
          submission_id: string;
          challenge_id: string;
          user_id: string;
          username: string;
          avatar_url: string | null;
          repo_url: string;
          deck_url: string | null;
          video_url: string | null;
          summary: string;
          submitted_at: string;
          llm_score: number;
          human_score: number | null;
          review_count: number;
          score: number;
          criterion_scores: Record<string, number>;
          feedback: string;
          evaluated_at: string;
          rank: number;
        };
      };
      final_scores: {
        Row: {
          submission_id: string;
          challenge_id: string;
          user_id: string;
          llm_score: number;
          human_score: number | null;
          review_count: number;
          final_score: number;
        };
      };
    };
    Functions: {
      exec_sql: {
        Args: { sql_query: string };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      difficulty: Difficulty;
      submission_status: SubmissionStatus;
    };
  };
}

// Helper types
export type User = Database['public']['Tables']['users']['Row'];
export type InsertUser = Database['public']['Tables']['users']['Insert'];
export type UpdateUser = Database['public']['Tables']['users']['Update'];

export type Challenge = Database['public']['Tables']['challenges']['Row'];
export type InsertChallenge = Database['public']['Tables']['challenges']['Insert'];
export type UpdateChallenge = Database['public']['Tables']['challenges']['Update'];

export type Submission = Database['public']['Tables']['submissions']['Row'];
export type InsertSubmission = Database['public']['Tables']['submissions']['Insert'];
export type UpdateSubmission = Database['public']['Tables']['submissions']['Update'];

export type Evaluation = Database['public']['Tables']['evaluations']['Row'];
export type InsertEvaluation = Database['public']['Tables']['evaluations']['Insert'];
export type UpdateEvaluation = Database['public']['Tables']['evaluations']['Update'];

export type ManualReview = Database['public']['Tables']['manual_reviews']['Row'];
export type InsertManualReview = Database['public']['Tables']['manual_reviews']['Insert'];
export type UpdateManualReview = Database['public']['Tables']['manual_reviews']['Update'];

export type LeaderboardEntry = Database['public']['Views']['leaderboard']['Row'];
export type FinalScore = Database['public']['Views']['final_scores']['Row'];

// Domain types
export interface SponsorProfile {
  id: string;
  username: string;
  email: string | null;
  company_name: string;
  company_logo_url: string | null;
  company_website: string | null;
  created_at: string;
}

export interface BuilderProfile {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_id: string;
  created_at: string;
}

export interface ChallengeWithSponsor extends Challenge {
  sponsor?: SponsorProfile;
}

export interface SubmissionWithDetails extends Submission {
  challenge: Challenge;
  user: BuilderProfile;
  evaluation?: Evaluation;
  manual_reviews?: ManualReview[];
  final_score?: FinalScore;
}

export interface RubricCriterion {
  name: string;
  weight: number;
  description: string;
}

export interface ChallengeRubric {
  criteria: RubricCriterion[];
}
