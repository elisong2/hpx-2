import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import ImageCarousel from "./ImageCarousel";

export interface BuildCardProps {
  id: string;
  title: string;
  description: string | null;
  username: string;
  avatar_url: string | null;
  make: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export default async function BuildCard({
  id,
  title,
  description,
  username,
  avatar_url,
  make,
  model,
  created_at,
  updated_at,
}: BuildCardProps) {
  console.log("build card", make, model, username, avatar_url);

  const supabase = await createClient();
  const { data: imagesData, error: imagesError } = await supabase
    .from("build_images")
    .select("image_url")
    .eq("build_id", id);

  if (imagesError) {
    throw new Error(imagesError.message);
  }
  console.log("The image paths:", imagesData);

  const imageUrls = imagesData.map(
    (img) =>
      supabase.storage.from("build-images").getPublicUrl(img.image_url).data
        .publicUrl,
  );

  console.log("final pic process", imageUrls);

  return (
    <>
      {/* <div>
        {coverImageUrl && <img src={coverImageUrl} alt={title} />}

        <h3>{title}</h3>
        <span>
          {make} {model}
        </span>
        <span>{description && <p>{description}</p>}</span>

        <span>by {username}</span>
        
      </div> */}

      <div className="card bg-base-100 w-96 shadow-sm">
        <figure className="px-10 pt-10">
          <ImageCarousel imageUrls={imageUrls} />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="card-actions m-5 flex items-center">
          <button className="btn btn-active">Details</button>
          <div className="flex flex-col items-center">
            <div className="badge badge-outline">{make}</div>
            <div className="badge badge-outline mt-1">{model}</div>
          </div>
        </div>
      </div>
    </>
  );
}
