"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export default function NewBuildButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        if (mounted) setUser(session?.user ?? null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("auth event:", event, session);
        if (mounted) setUser(session?.user ?? null);

        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          try {
            // router.refresh();
            window.location.reload();
          } catch {
            window.location.reload();
          }
        }
      },
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, [supabase, router]);

  if (user) {
    return (
      <button
        className=""
        onClick={async () => {
          await supabase.auth.signOut();
          setUser(null);
          router.push("/newBuild");
        }}
      >
        Create a New Build!
      </button>
    );
  }
  return null;
}
