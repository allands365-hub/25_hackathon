// Seed challenge data for BuildAI Arena
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const challenges = [
  {
    title: 'AI-Powered Customer Support Bot',
    description: 'Build an intelligent customer support chatbot that can handle common queries, escalate complex issues, and learn from interactions.',
    problem_statement: `Companies waste millions on repetitive customer support queries. Your challenge: Create an AI-powered support bot that can:

- Answer common customer questions with 90%+ accuracy
- Understand context and maintain conversation history
- Escalate complex issues to human agents seamlessly
- Learn and improve from customer interactions

The solution should demonstrate production-ready quality with proper error handling, rate limiting, and a clean user interface.`,
    rubric: {
      criteria: [
        {
          name: 'Technical Implementation',
          weight: 30,
          description: 'Code quality, architecture, scalability, and proper use of LLM APIs'
        },
        {
          name: 'User Experience',
          weight: 25,
          description: 'Interface design, conversational flow, and ease of use'
        },
        {
          name: 'Innovation',
          weight: 20,
          description: 'Novel approaches to common problems, creative features'
        },
        {
          name: 'Production Readiness',
          weight: 15,
          description: 'Error handling, testing, documentation, deployment considerations'
        },
        {
          name: 'Problem Solving',
          weight: 10,
          description: 'How well the solution addresses the stated problem'
        }
      ]
    },
    difficulty: 'Intermediate',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    sponsor_name: 'TechCorp',
    sponsor_logo_url: null
  },
  {
    title: 'Smart Document Q&A System',
    description: 'Create a RAG (Retrieval Augmented Generation) system that can answer questions about uploaded documents with citations.',
    problem_statement: `Knowledge workers spend hours searching through documents. Build a smart Q&A system that:

- Accepts PDF, Markdown, or text document uploads
- Chunks and indexes documents for efficient retrieval
- Answers questions with relevant citations from the source
- Handles multi-document queries

Bonus points for supporting semantic search, handling tables/images, and providing confidence scores.`,
    rubric: {
      criteria: [
        {
          name: 'RAG Implementation',
          weight: 35,
          description: 'Quality of document chunking, embedding, retrieval, and generation'
        },
        {
          name: 'Accuracy & Citations',
          weight: 25,
          description: 'Correctness of answers and quality of source attribution'
        },
        {
          name: 'Technical Architecture',
          weight: 20,
          description: 'Vector database usage, caching, performance optimization'
        },
        {
          name: 'User Interface',
          weight: 15,
          description: 'Document upload flow, query interface, results presentation'
        },
        {
          name: 'Edge Cases',
          weight: 5,
          description: 'Handling of large documents, ambiguous queries, no-answer scenarios'
        }
      ]
    },
    difficulty: 'Advanced',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days
    sponsor_name: 'DataFlow AI',
    sponsor_logo_url: null
  },
  {
    title: 'AI Code Review Assistant',
    description: 'Build a tool that analyzes pull requests and provides intelligent code review suggestions.',
    problem_statement: `Code reviews are time-consuming but critical for code quality. Create an AI assistant that:

- Analyzes GitHub pull requests automatically
- Identifies bugs, security issues, and performance problems
- Suggests improvements for code style and best practices
- Provides constructive, actionable feedback

The tool should integrate seamlessly with GitHub and provide value beyond basic linting.`,
    rubric: {
      criteria: [
        {
          name: 'Analysis Quality',
          weight: 35,
          description: 'Accuracy of bug detection, security analysis, and code quality assessment'
        },
        {
          name: 'GitHub Integration',
          weight: 25,
          description: 'Seamless PR analysis, comment formatting, webhook handling'
        },
        {
          name: 'Actionable Feedback',
          weight: 20,
          description: 'Clarity of suggestions, code examples, prioritization of issues'
        },
        {
          name: 'Technical Depth',
          weight: 15,
          description: 'Understanding of programming concepts, language-specific patterns'
        },
        {
          name: 'Performance',
          weight: 5,
          description: 'Speed of analysis, efficient API usage, caching strategies'
        }
      ]
    },
    difficulty: 'Advanced',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    sponsor_name: 'DevTools Inc',
    sponsor_logo_url: null
  },
  {
    title: 'Personal AI Learning Tutor',
    description: 'Design an adaptive learning assistant that helps users master new topics through personalized lessons and quizzes.',
    problem_statement: `One-size-fits-all education doesn't work. Build a personal tutor that:

- Adapts to the learner's pace and understanding level
- Generates custom lessons on any topic
- Creates practice questions and provides explanations
- Tracks progress and identifies knowledge gaps

Focus on making learning engaging and effective with immediate, helpful feedback.`,
    rubric: {
      criteria: [
        {
          name: 'Adaptive Learning',
          weight: 30,
          description: 'Quality of personalization, difficulty adjustment, progress tracking'
        },
        {
          name: 'Content Generation',
          weight: 25,
          description: 'Lesson quality, question variety, explanation clarity'
        },
        {
          name: 'User Engagement',
          weight: 20,
          description: 'Interface design, gamification elements, motivation features'
        },
        {
          name: 'Learning Effectiveness',
          weight: 15,
          description: 'Knowledge retention strategies, spaced repetition, feedback quality'
        },
        {
          name: 'Technical Implementation',
          weight: 10,
          description: 'Code quality, data persistence, performance'
        }
      ]
    },
    difficulty: 'Intermediate',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    sponsor_name: 'EduTech Solutions',
    sponsor_logo_url: null
  },
  {
    title: 'AI Meeting Summarizer',
    description: 'Create a tool that transcribes meetings and generates concise summaries with action items.',
    problem_statement: `Meetings generate valuable information that gets lost. Build a meeting assistant that:

- Transcribes audio/video recordings accurately
- Identifies key discussion points and decisions
- Extracts action items with owners and deadlines
- Generates shareable meeting notes

The solution should handle multiple speakers, technical jargon, and produce professional-quality outputs.`,
    rubric: {
      criteria: [
        {
          name: 'Transcription Quality',
          weight: 25,
          description: 'Accuracy of speech-to-text, speaker identification, timestamp precision'
        },
        {
          name: 'Summarization',
          weight: 30,
          description: 'Conciseness, key point extraction, logical flow of summary'
        },
        {
          name: 'Action Item Extraction',
          weight: 20,
          description: 'Accuracy of task identification, owner assignment, deadline detection'
        },
        {
          name: 'Output Quality',
          weight: 15,
          description: 'Formatting, readability, shareability of meeting notes'
        },
        {
          name: 'Technical Implementation',
          weight: 10,
          description: 'Audio processing, API integration, error handling'
        }
      ]
    },
    difficulty: 'Beginner',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days
    sponsor_name: 'MeetingOS',
    sponsor_logo_url: null
  }
];

async function seedChallenges() {
  console.log('🌱 Seeding challenge data...\n');

  try {
    // Check if challenges already exist
    const { data: existing } = await supabase
      .from('challenges')
      .select('title');

    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing challenges. Skipping seed.`);
      console.log('   Delete existing challenges first if you want to re-seed.\n');
      return;
    }

    // Insert challenges
    const { data, error } = await supabase
      .from('challenges')
      .insert(challenges)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully seeded ${data.length} challenges:\n`);
    data.forEach((challenge, index) => {
      console.log(`   ${index + 1}. ${challenge.title} (${challenge.difficulty})`);
    });

    console.log('\n🎉 Challenge seeding complete!\n');

  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
}

seedChallenges();
