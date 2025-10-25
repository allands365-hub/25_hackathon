# Supabase MCP Setup Instructions

## What is MCP?
MCP (Model Context Protocol) allows Claude to directly interact with external services like Supabase through a standardized interface.

## Setting up Supabase MCP in Claude Code

1. **Install Supabase MCP Server** (if not already installed):
   ```bash
   npm install -g @modelcontextprotocol/server-supabase
   ```

2. **Configure MCP in Claude Code Settings**:
   - Open Claude Code settings
   - Navigate to MCP Servers section
   - Add a new server configuration:

   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-supabase",
           "YOUR_SUPABASE_PROJECT_URL",
           "YOUR_SUPABASE_SERVICE_ROLE_KEY"
         ]
       }
     }
   }
   ```

3. **Get your Supabase credentials**:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy:
     - Project URL
     - `anon/public` key (for client-side)
     - `service_role` key (for server-side/MCP)

4. **Update your .env.local file** with the actual values

## Using MCP in the Hackathon

Once configured, Claude will be able to:
- Query your Supabase database directly
- Help you design and modify database schemas
- Generate SQL queries
- Assist with data operations
- Debug database issues in real-time

## Alternative: Manual Supabase Integration

If MCP is not available, you can use the standard Supabase client library (already installed):
- Client-side: `import { supabase } from '@/lib/supabase/client'`
- Server-side: `import { supabaseAdmin } from '@/lib/supabase/server'`
