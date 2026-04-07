import { createClient } from "@/lib/supabase/server";
import PartsClient from "./PartsClient";

export type Part = {
  id: string;
  name: string;
  category: string | null;
  make: string | null;
  model: string | null;
  price: number | null;
  currency: string | null;
  in_stock: boolean | null;
  product_url: string | null;
  image_url: string | null;
  vendor_id: string | null;
};

export default async function PartsPage() {
  const supabase = await createClient();

  // Fetch parts, vendors, and current user in parallel
  const [partsResult, vendorsResult, userResult] = await Promise.all([
    supabase
      .from("parts")
      .select("id, name, category, make, model, price, currency, in_stock, product_url, image_url, vendor_id")
      .order("name"),
    supabase.from("vendors").select("id, name"),
    supabase.auth.getUser(),
  ]);

  if (partsResult.error) throw new Error(partsResult.error.message);
  if (vendorsResult.error) throw new Error(vendorsResult.error.message);

  const user = userResult.data?.user ?? null;

  // Fetch user's wishlisted part IDs if logged in
  let wishlistedPartIds: string[] = [];
  if (user) {
    const { data: wishlistData } = await supabase
      .from("wishlists")
      .select("part_id")
      .eq("user_id", user.id);
    wishlistedPartIds = (wishlistData ?? []).map((w) => w.part_id);
  }

  // Build lookup for vendor names
  const vendorMap: Record<string, string> = {};
  for (const v of vendorsResult.data) {
    vendorMap[v.id] = v.name;
  }

  // Extract unique filter values
  const categories = [...new Set(partsResult.data.map((p) => p.category).filter(Boolean))] as string[];
  const makes = [...new Set(partsResult.data.map((p) => p.make).filter(Boolean))] as string[];
  const models = [...new Set(partsResult.data.map((p) => p.model).filter(Boolean))] as string[];

  categories.sort();
  makes.sort();
  models.sort();

  return (
    <PartsClient
      parts={partsResult.data}
      vendorMap={vendorMap}
      categories={categories}
      makes={makes}
      models={models}
      userId={user?.id ?? null}
      initialWishlist={wishlistedPartIds}
    />
  );
}
