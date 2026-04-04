import { createClient } from "@/lib/supabase/server";
import GalleryClient from "./GalleryClient";

export type BuildWithImages = {
  id: string;
  title: string;
  description: string | null;
  make: string;
  model: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  coverImage: string | null;
};

export default async function BuildsPage() {
  const supabase = await createClient();

  const [buildsResult, makesResult] = await Promise.all([
    supabase
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
      .order("created_at", { ascending: false }),
    supabase.from("makes").select("name").order("name"),
  ]);

  if (buildsResult.error) throw new Error(buildsResult.error.message);
  if (makesResult.error) throw new Error(makesResult.error.message);

  // Fetch first image for each build as cover
  const buildsWithImages: BuildWithImages[] = await Promise.all(
    buildsResult.data.map(async (build) => {
      const { data: imageData } = await supabase
        .from("build_images")
        .select("image_url")
        .eq("build_id", build.id)
        .limit(1)
        .single();

      let coverImage: string | null = null;
      if (imageData) {
        coverImage = supabase.storage
          .from("build-images")
          .getPublicUrl(imageData.image_url).data.publicUrl;
      }

      return {
        id: build.id,
        title: build.title,
        description: build.description,
        make: build.make_id.name,
        model: build.model_id.name,
        username: build.profile_id.username,
        avatar_url: build.profile_id.avatar_url,
        created_at: build.created_at,
        updated_at: build.updated_at,
        coverImage,
      };
    }),
  );

  const makes = makesResult.data.map((m) => m.name);

  return <GalleryClient builds={buildsWithImages} makes={makes} />;
}
