"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SupabaseAuthListener() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh(); // ⬅ key line
    });

    return () => subscription?.unsubscribe();
  }, [supabase, router]);

  return null;
}
