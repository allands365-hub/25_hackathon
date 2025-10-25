# Security Guidelines for BuildAI Arena

## Environment Variables

This project uses several environment variables that must be kept secure:

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (safe to expose)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (safe to expose)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (KEEP SECRET)
- `GROQ_API_KEY` - Groq AI API key (KEEP SECRET)

### GitHub OAuth Configuration

GitHub OAuth credentials are configured directly in the Supabase Dashboard under Authentication > Providers > GitHub. No environment variables needed.

## Security Best Practices

### 1. Never Commit Sensitive Data

- ✅ Environment variables are in `.env.local` (gitignored)
- ✅ API keys are only in environment variables
- ✅ No hardcoded secrets in code
- ✅ `.mcp.json` is gitignored (contains Supabase access token)

### 2. File Security

The following files are automatically ignored by git:
- `.env*` files
- `.mcp.json` (contains Supabase access token)
- `test-*.js`, `debug-*.js`, `check-*.js` (may contain sensitive test data)
- `*.key`, `*.pem` files

### 3. API Security

- All API routes use proper authentication checks
- Row Level Security (RLS) policies protect database access
- User data is only accessible to authenticated users
- Submissions are publicly viewable but only editable by owners

### 4. Authentication

- GitHub OAuth via Supabase Auth
- JWT tokens handled securely by Supabase
- No password storage required
- Session management handled by Supabase

## Setup Instructions

1. Copy `env.example` to `.env.local`
2. Fill in your actual environment variable values
3. Copy `mcp.json.template` to `.mcp.json` (if using MCP tools)
4. Fill in your Supabase access token in `.mcp.json`

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers.

## Security Audit Checklist

- [ ] No API keys in source code
- [ ] All environment variables properly configured
- [ ] RLS policies properly configured
- [ ] Authentication working correctly
- [ ] No sensitive data in git history
- [ ] All test files with sensitive data are gitignored
