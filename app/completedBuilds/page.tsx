import BuildCard from "@/app/components/BuildCard";
import { createClient } from "@/lib/supabase/server";

export default async function BuildsPage() {
  const supabase = createClient();
    .from("builds")
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
        {builds?.map((build) => (
          <BuildCard
            key={build.id}
            id={build.id}
            title={build.title}
            description={build.description}
            coverImageUrl={build.cover_image_url}
            username={build.profiles.username}
          />
        ))}
      </section>
    </main>
  );
}
