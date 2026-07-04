import { createBrowserClient } from "@supabase/ssr";

// Not typed against the generated Database schema: the hand-written types in
// `@/types/database` describe table shapes for use in components, but don't
// include the `Relationships` metadata the Supabase client needs to type
// joined `select()` queries. Run `supabase gen types typescript` and swap it
// in once the schema stabilizes.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
