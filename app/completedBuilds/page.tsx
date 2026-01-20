import BuildCard from "@/app/components/BuildCard";
import { createClient } from "@/lib/supabase/server";

export default async function BuildsPage() {
  const { data: posts, error } = await createClient()
    .from("posts")
    .select(
      `
      id,
      title,
      description,
      cover_image_url,
      profiles (
        username
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main>
      <h1>Car Builds</h1>

      <section>
        {posts?.map((post) => (
          <BuildCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            coverImageUrl={post.cover_image_url}
            username={post.profiles.username}
          />
        ))}
      </section>
    </main>
  );
}
