import { createClient } from "@/lib/supabase/server";
import WishlistClient from "./WishlistClient";

export type WishlistPart = {
  id: string;
  name: string;
  category: string | null;
  make: string | null;
  model: string | null;
  price: number | null;
  product_url: string | null;
  image_url: string | null;
  vendor_name: string | null;
};

export default async function WishlistPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="font-pixel text-[10px] uppercase text-gray-400">
          Sign in to view your wishlist
        </p>
      </div>
    );
  }

  // Fetch wishlist items joined with parts and vendors
  const { data: wishlistData, error } = await supabase
    .from("wishlists")
    .select(
      "part_id, parts(id, name, category, make, model, price, product_url, image_url, vendor_id, vendors(name))",
    )
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const parts: WishlistPart[] = (wishlistData ?? []).map((w: any) => ({
    id: w.parts.id,
    name: w.parts.name,
    category: w.parts.category,
    make: w.parts.make,
    model: w.parts.model,
    price: w.parts.price,
    product_url: w.parts.product_url,
    image_url: w.parts.image_url,
    vendor_name: w.parts.vendors?.name ?? null,
  }));

  return <WishlistClient parts={parts} userId={user.id} />;
}
