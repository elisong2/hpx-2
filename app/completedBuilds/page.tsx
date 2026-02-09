import BuildCard from "@/app/components/BuildCard";
import { createClient } from "@/lib/supabase/server";
import NewBuildButton from "../components/NewBuildButton";

export default async function BuildsPage() {
  const supabase = await createClient();

  const { data: buildsData, error: buildsError } = await supabase
    .from("builds")
    .select(
      `
      id,
      title,
      description,
      make_id (name),
      model_id (name),
      profile_id (
        username,
        avatar_url
      ),
      created_at,
      updated_at
    `,
    )
    .order("created_at", { ascending: false });

  if (buildsError) {
    throw new Error(buildsError.message);
  }
  console.log("The Builds:", buildsData);

  return (
    <main className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex justify-center mt-6">
        Gallery
      </h1>

      <NewBuildButton />

      <div
        className="grid gap-6 px-6 mt-6
               [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        {buildsData?.map((build) => (
          <BuildCard
            key={build.id}
            id={build.id}
            title={build.title}
            description={build.description}
            username={build.profile_id.username}
            avatar_url={build.profile_id.avatar_url}
            make={build.make_id.name}
            model={build.model_id.name}
            created_at={build.created_at}
            updated_at={build.updated_at}
          />
        ))}
      </div>
    </main>
  );
}
