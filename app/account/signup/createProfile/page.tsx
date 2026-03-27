"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateProfilePage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in");
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      username: username,
      bio: bio || "Hello world!",
    });

    if (error) {
      console.error(error);
      alert("Error creating profile.");
    } else {
      // router.push(`/user/${username}`);
      window.location.href = `/user/${username}`;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered"
      />

      {/* <input
        type="text"
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="input input-bordered"
      /> */}
      <button className="btn btn-primary" type="submit">
        Create Profile
      </button>
    </form>
  );
}
