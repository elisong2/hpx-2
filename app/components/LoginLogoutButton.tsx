"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

const LoginButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const fetchUserAndProfile = async (mounted: { current: boolean }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!mounted.current) return;

    const sessionUser = session?.user ?? null;
    setUser(sessionUser);

    if (sessionUser) {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", sessionUser.id)
        .single();
      if (mounted.current) setUsername(data?.username ?? null);
    } else {
      setUsername(null);
    }
  };

  // Re-check session on every route change
  useEffect(() => {
    const mounted = { current: true };
    fetchUserAndProfile(mounted);
    return () => {
      mounted.current = false;
    };
  }, [pathname, supabase]);

  // Also listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [supabase]);

  if (user) {
    return (
      <div className="flex items-center gap-1">
        {username && (
          <button
            className="font-pixel text-[10px] uppercase px-3 py-2 hover:bg-te-grey transition-colors cursor-pointer"
            onClick={() => router.push(`/user/${username}`)}
          >
            {username}
          </button>
        )}
        <button
          className="font-pixel text-[10px] uppercase px-3 py-2 te-border hover:bg-te-red hover:text-white transition-colors cursor-pointer"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
            window.location.href = "/";
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      className="font-pixel text-[10px] uppercase px-3 py-2 te-border hover:bg-te-orange transition-colors cursor-pointer"
      onClick={() => router.push("/account/login")}
    >
      Log in
    </button>
  );
};

export default LoginButton;
