"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  // const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  // const [website, setWebsite] = useState<string | null>(null);
  // const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, bio`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        // setFullname(data.full_name);
        setUsername(data.username);
        // setWebsite(data.website);
        // setAvatarUrl(data.avatar_url);
        setBio(data.bio);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    bio,
  }: {
    username: string | null;
    // fullname: string | null;
    // website: string | null;
    bio: string | null;
    // avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        // full_name: fullname,
        username,
        bio,
        // website,
        // avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      {/* <Avatar
        uid={user?.id ?? null}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ fullname, username, website, avatar_url: url });
        }}
      /> */}

      {/* ... */}

      <div>
        <label htmlFor="email">Email: </label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>

      <div>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio: </label>
        <input
          id="bio"
          type="text"
          value={bio || ""}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <br />

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, bio })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
    </div>
  );
}
