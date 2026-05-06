import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://uhkwlooejmhtjaspdvju.supabase.co", // ✅ base project URL ONLY
  "sb_publishable_6eTecZf4qLMln2qD4zU0ig_hsYO-x7k"
);