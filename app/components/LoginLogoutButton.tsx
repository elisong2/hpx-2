"use client";
import React, { useEffect, useMemo, useState } from "react";
// import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/utils/auth-actions";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

const LoginButton = () => {
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
        className="fixed top-4 right-4 z-50"
        onClick={async () => {
          await supabase.auth.signOut();
          setUser(null);
          router.push("/account/logout");
        }}
      >
        Log out
      </button>
    );
  }

  return (
    <button
      className="fixed top-4 right-4 z-50"
      onClick={() => {
        router.push("/account/login");
      }}
    >
      Login
    </button>
  );
};

export default LoginButton;
