"use server";

import { createClient } from "@/lib/supabase/server";

export async function newBuildHelper(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const make_id = Number(formData.get("make_id"));
  const model_id = Number(formData.get("model_id"));

  const files = formData.getAll("images") as File[];
  console.log("Files received:", files);
  const paths: string[] = [];

  console.log("User in server action:", user);

  // Insert build data into builds table
  const { data: build, error: buildError } = await supabase.from("builds").insert({
    title: title,
    description: description,
    make_id: make_id,
    model_id: model_id,
  })
    .select()
    .single();

  console.log("DB insert:", build, buildError);
  if (buildError) throw buildError;

  const buildId = build.id;

  // Upload images to storage
  for (const file of files) {
    const fileName = `${buildId}/${crypto.randomUUID()}-${file.name}`;

    const { data: picUpload, error: picUploadError } = await supabase.storage
      .from("build-images")
      .upload(fileName, file);

    if (picUploadError) throw picUploadError;

    paths.push(picUpload.path);
  }
  console.log("Uploaded image paths:", paths);

  // creates array of images for build_images table 
  const imageRows = paths.map((path, index) => ({
    build_id: buildId,
    image_url: path,
    sort_order: index,
  }));

  console.log("Image rows:", imageRows);

  // Insert build images
  const { error: imageError } = await supabase
    .from("build_images")
    .insert(imageRows);

  if (imageError) throw imageError;
}


//////////

// export async function newBuild(formData: FormData) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   console.log("User in server action:", user);
//   const { data, error } = await supabase.from("builds").insert({
//     title: formData.get("title"),
//     description: formData.get("description"),
//     make_id: 1,
//     model_id: 3,
//   });
//   console.log(data);
//   console.log(error);
// }