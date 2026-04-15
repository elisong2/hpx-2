"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, Send, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  last_updated: string | null;
  profile_id: string;
  username: string;
  avatar_url: string | null;
};

type Props = {
  buildId: string;
  initialComments: Comment[];
  currentUserId: string | null;
  currentUsername: string | null;
  currentAvatarUrl: string | null;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommentsSection({
  buildId,
  initialComments,
  currentUserId,
  currentUsername,
  currentAvatarUrl,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !currentUserId) return;

    setPosting(true);
    setError(null);

    // Insert and read back with profile join
    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({
        build_id: buildId,
        profile_id: currentUserId,
        content,
      })
      .select(
        `
        id,
        content,
        created_at,
        last_updated,
        profile_id
      `,
      )
      .single();

    setPosting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Failed to post comment");
      return;
    }

    const newComment: Comment = {
      id: data.id,
      content: data.content,
      created_at: data.created_at,
      last_updated: data.last_updated,
      profile_id: data.profile_id,
      username: currentUsername ?? "you",
      avatar_url: currentAvatarUrl,
    };

    setComments((prev) => [newComment, ...prev]);
    setDraft("");
  };

  return (
    <div className="te-border-thick bg-[var(--background)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b-2 border-te-border">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} strokeWidth={3} />
          <h3 className="font-pixel text-[10px] uppercase tracking-wider">
            Comments
          </h3>
        </div>
        <span className="te-border font-pixel text-[10px] px-2 py-1 bg-te-yellow text-te-dark">
          {comments.length}
        </span>
      </div>

      {/* Comment list */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 min-h-[200px] max-h-[600px] te-scrollbar">
        {comments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="te-border w-12 h-12 flex items-center justify-center bg-te-grey">
              <MessageSquare
                size={20}
                strokeWidth={2.5}
                className="text-gray-400"
              />
            </div>
            <p className="font-pixel text-[9px] uppercase text-gray-400 tracking-wider">
              No comments yet
            </p>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Be the first to leave a comment!
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="te-border bg-te-grey p-3 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <Link
                  href={`/user/${c.username}`}
                  className="flex items-center gap-2 hover:text-te-orange transition-colors"
                >
                  <div className="te-border w-6 h-6 bg-[var(--background)] flex items-center justify-center shrink-0">
                    <User size={11} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-bold uppercase">
                    {c.username}
                  </span>
                </Link>
                <span className="text-[10px] text-gray-500 font-mono">
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="border-t-2 border-te-border p-5">
        {currentUserId ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Leave a comment..."
              rows={3}
              className="te-border bg-te-grey text-xs px-3 py-2 outline-none focus:border-te-orange resize-none leading-relaxed"
              disabled={posting}
            />
            {error && (
              <p className="text-[10px] text-te-red font-mono">{error}</p>
            )}
            <button
              type="submit"
              disabled={!draft.trim() || posting}
              className="te-border-thick te-shadow-sm te-card-hover bg-te-orange text-te-dark font-pixel text-[9px] uppercase px-4 py-2 flex items-center justify-center gap-2 self-end disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {posting ? "Posting..." : "Post"}
              <Send size={12} strokeWidth={3} />
            </button>
          </form>
        ) : (
          <div className="te-border bg-te-grey p-4 text-center flex flex-col gap-2">
            <p className="font-pixel text-[9px] uppercase text-gray-500 tracking-wider">
              Sign in to comment
            </p>
            <Link
              href="/login"
              className="text-xs font-bold uppercase hover:text-te-orange transition-colors"
            >
              Log in →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
