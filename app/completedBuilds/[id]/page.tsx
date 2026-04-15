import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, ExternalLink, Wrench } from "lucide-react";
import BuildImageCarousel from "./BuildImageCarousel";
import CommentsSection, { type Comment } from "./CommentsSection";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BuildDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: build, error } = await supabase
    .from("builds")
    .select(
      `
      id,
      title,
      description,
      created_at,
      updated_at,
      make_id (name),
      model_id (name),
      profile_id (username, avatar_url)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !build) {
    notFound();
  }

  // Fetch all images for this build
  const { data: imageRows } = await supabase
    .from("build_images")
    .select("image_url")
    .eq("build_id", id);

  const imageUrls = (imageRows ?? []).map(
    (row) =>
      supabase.storage.from("build-images").getPublicUrl(row.image_url).data
        .publicUrl,
  );

  // Fetch parts list for this build
  const { data: partRows } = await supabase
    .from("builds_parts")
    .select("id, part_link, created_at")
    .eq("builds_id", id)
    .order("created_at", { ascending: true });

  const parts = partRows ?? [];

  // Fetch comments for this build (join profile for username/avatar)
  const { data: commentRows } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      created_at,
      last_updated,
      profile_id,
      profiles:profile_id (username, avatar_url)
    `,
    )
    .eq("build_id", id)
    .order("created_at", { ascending: false });

  const comments: Comment[] = (commentRows ?? []).map((c: any) => ({
    id: c.id,
    content: c.content,
    created_at: c.created_at,
    last_updated: c.last_updated,
    profile_id: c.profile_id,
    username: c.profiles?.username ?? "unknown",
    avatar_url: c.profiles?.avatar_url ?? null,
  }));

  // Current user (for comment posting)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUsername: string | null = null;
  let currentAvatarUrl: string | null = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    currentUsername = profileData?.username ?? null;
    currentAvatarUrl = profileData?.avatar_url ?? null;
  }

  const make = (build.make_id as any).name;
  const model = (build.model_id as any).name;
  const profile = build.profile_id as any;
  const username = profile.username;
  const date = new Date(build.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen">
      {/* ---- Page header ---- */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/completedBuilds"
            className="te-border font-pixel text-[9px] uppercase px-3 py-1 hover:bg-te-yellow transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={12} strokeWidth={3} />
            Gallery
          </Link>
          <h1 className="font-pixel text-lg uppercase tracking-tight">Build</h1>
        </div>
      </div>

      {/* ---- Content ---- */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-20 py-8 flex flex-col gap-8">
        {/* Title + badges */}
        <div className="flex flex-col gap-4">
          <h2 className="font-pixel text-xl sm:text-2xl uppercase tracking-tight leading-snug">
            {build.title}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <span className="te-border text-xs font-bold uppercase px-3 py-1 bg-te-yellow text-te-dark">
              {make}
            </span>
            <span className="te-border text-xs font-bold uppercase px-3 py-1">
              {model}
            </span>
          </div>
        </div>

        {/* Author + date strip */}
        <div className="te-border-thick bg-[var(--background)] px-5 py-4 flex items-center justify-between">
          <Link
            href={`/user/${username}`}
            className="flex items-center gap-3 hover:text-te-orange transition-colors"
          >
            <User size={16} strokeWidth={3} />
            <span className="text-sm font-bold uppercase">{username}</span>
          </Link>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar size={14} />
            <span className="text-xs font-mono">{date}</span>
          </div>
        </div>

        {/* Main two-column: left content (carousel + parts + description), right comments */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* ---- Left column ---- */}
          <div className="xl:col-span-3 flex flex-col gap-8">
            {/* Carousel + parts list inner grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Image carousel */}
              <div className="lg:col-span-3">
                <BuildImageCarousel imageUrls={imageUrls} />
              </div>

              {/* Parts list */}
              <div className="lg:col-span-2 te-border-thick bg-[var(--background)] p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-te-border">
                  <div className="flex items-center gap-2">
                    <Wrench size={14} strokeWidth={3} />
                    <h3 className="font-pixel text-[10px] uppercase tracking-wider">
                      Parts Used
                    </h3>
                  </div>
                  <span className="te-border font-pixel text-[10px] px-2 py-1 bg-te-cyan text-te-dark">
                    {parts.length}
                  </span>
                </div>

                {parts.length > 0 ? (
                  <ul className="flex flex-col divide-y-2 divide-te-border">
                    {parts.map((part, idx) => (
                      <li
                        key={part.id}
                        className="py-3 flex items-center gap-4"
                      >
                        <span className="font-pixel text-[10px] text-gray-400 w-6 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <a
                          href={part.part_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-xs uppercase tracking-wide hover:text-te-orange transition-colors inline-flex items-center gap-2 break-all flex-1 min-w-0"
                        >
                          <span className="truncate">{part.part_link}</span>
                          <ExternalLink
                            size={11}
                            strokeWidth={2.5}
                            className="shrink-0 opacity-40"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <div className="te-border w-12 h-12 flex items-center justify-center bg-te-grey">
                      <Wrench
                        size={20}
                        strokeWidth={2.5}
                        className="text-gray-400"
                      />
                    </div>
                    <p className="font-pixel text-[9px] uppercase text-gray-400 tracking-wider">
                      No parts listed
                    </p>
                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                      The builder hasn&apos;t added a parts list for this build
                      yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {build.description && (
              <div className="te-border-thick bg-[var(--background)] p-6">
                <h3 className="font-pixel text-[10px] uppercase tracking-wider mb-4 pb-3 border-b-2 border-te-border">
                  About this build
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {build.description}
                </p>
              </div>
            )}
          </div>

          {/* ---- Right column: comments ---- */}
          <div className="xl:col-span-1">
            <CommentsSection
              buildId={build.id}
              initialComments={comments}
              currentUserId={user?.id ?? null}
              currentUsername={currentUsername}
              currentAvatarUrl={currentAvatarUrl}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
