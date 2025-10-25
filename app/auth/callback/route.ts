import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    // Use admin client for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Exchange code for session using admin client
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Auth callback error:', sessionError);
      return NextResponse.redirect(`${origin}/auth/error`);
    }

    if (session?.user) {
      // Get GitHub user data from session
      const githubUser = session.user.user_metadata;

      // Create or update user profile in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!existingUser) {
        // Create new user profile
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            github_id: session.user.id,
            username: githubUser.user_name || githubUser.preferred_username || 'anonymous',
            email: session.user.email,
            avatar_url: githubUser.avatar_url,
            bio: githubUser.bio || null,
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      } else {
        // Update existing user profile with latest GitHub data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            username: githubUser.user_name || githubUser.preferred_username || existingUser.username,
            email: session.user.email,
            avatar_url: githubUser.avatar_url,
            bio: githubUser.bio || existingUser.bio,
          })
          .eq('id', session.user.id);

        if (updateError) {
          console.error('Error updating user profile:', updateError);
        }
      }
    }

    // Redirect to profile
    return NextResponse.redirect(`${origin}/profile`);
  }

  // No code provided, redirect to home
  return NextResponse.redirect(`${origin}/`);
}
