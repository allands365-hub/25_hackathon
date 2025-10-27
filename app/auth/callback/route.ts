import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const role = requestUrl.searchParams.get('role'); // Get role from URL params
  const origin = requestUrl.origin;

  console.log('[AUTH CALLBACK] Request received:', {
    url: request.url,
    origin,
    code: !!code,
    role,
  });

  if (code) {
    const cookieStore = await cookies();

    // Create a response object to set cookies on
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set cookies on both the cookie store and the response
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Exchange code for session with proper cookie storage
    console.log('[AUTH CALLBACK] Exchanging code for session...');
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('[AUTH CALLBACK] Session error:', sessionError);
      const errorResponse = NextResponse.redirect(`${origin}/auth/error`);
      // Copy cookies even on error
      response.cookies.getAll().forEach(cookie => {
        errorResponse.cookies.set(cookie.name, cookie.value);
      });
      return errorResponse;
    }

    if (session?.user) {
      console.log('[AUTH CALLBACK] Session obtained, user:', session.user.id);
      
      // Get GitHub user data from session
      const githubUser = session.user.user_metadata;

      // Use admin client for database operations (to bypass RLS)
      const { supabaseAdmin } = await import('@/lib/supabase/server');

      // Create or update user profile in our users table
      console.log('[AUTH CALLBACK] Checking existing user...');
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      let userRole = existingUser?.role;
      let needsOnboarding = false;

      if (!existingUser) {
        // Create new user profile based on role
        const userData: any = {
          id: session.user.id,
          github_id: session.user.id,
          username: githubUser.user_name || githubUser.preferred_username || 'anonymous',
          email: session.user.email,
          avatar_url: githubUser.avatar_url,
          bio: githubUser.bio || null,
        };

        // Set role based on signup method
        if (role === 'builder') {
          userData.role = 'builder';
        } else if (role === 'sponsor') {
          userData.role = 'sponsor';
          needsOnboarding = true; // Sponsors need to complete company info
        } else {
          // Default to builder if no role specified
          userData.role = 'builder';
        }

        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert(userData);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }

        userRole = userData.role;
      } else {
        // Update existing user profile with latest GitHub data
        const { error: updateError } = await supabaseAdmin
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

        // Check if sponsor needs company info
        if (userRole === 'sponsor' && !existingUser.company_name) {
          needsOnboarding = true;
        }
      }

      // Redirect based on user status and role
      let redirectUrl;
      if (needsOnboarding) {
        // New sponsor or sponsor without company info - needs onboarding
        redirectUrl = `${origin}/onboarding`;
      } else if (userRole === 'sponsor') {
        // Existing sponsor - redirect to sponsor dashboard
        redirectUrl = `${origin}/sponsor`;
      } else {
        // Builder - redirect to challenges
        redirectUrl = `${origin}/challenges`;
      }

      console.log('[AUTH CALLBACK] Redirecting to:', redirectUrl);

      // Create redirect response with cookies
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // Copy all cookies from the response to the redirect response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });

      return redirectResponse;
    }
  }

  // No code provided, redirect to home
  return NextResponse.redirect(`${origin}/`);
}
