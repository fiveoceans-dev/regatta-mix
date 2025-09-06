# Multi-domain Auth Configuration Checklist

1. **Allowed URLs**
   - In Supabase dashboard, go to **Authentication → URL Configuration**.
   - Add each site to `Site URL` and `Redirect URLs`:
     - `https://cyber.sailing`
     - `https://site1.example`
     - `https://site2.example`

2. **OAuth Providers**
   - For each OAuth provider, register callback URLs for all domains.
   - Example for GitHub: `https://cyber.sailing/auth/v1/callback`, `https://site1.example/auth/v1/callback`, `https://site2.example/auth/v1/callback`.
   - Add the URLs in the provider settings inside Supabase.

3. **Session Isolation**
   - Sessions are isolated per origin; logging into one domain does not automatically set cookies on another.
   - Because auth.users is global, users sign in on each domain using the same credentials and receive SSO-like experience.

4. **Branding**
   - Supabase uses a single set of email templates. For site-specific branding, redirect magic link emails to a custom page that styles based on `host`.

5. **Edge Function Hook**
   - After authentication, call `public.ensure_membership_for_domain()` to ensure the user has at least a `member` row in `public.site_members` for the current domain.
