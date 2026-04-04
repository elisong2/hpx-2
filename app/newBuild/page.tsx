import { createClient } from "@/lib/supabase/server";
import NewBuildForm from "../components/NewBuildForm";

export default async function NewBuildPage() {
  const supabase = await createClient();

  const { data: makes } = await supabase
    .from("makes")
    .select("id, name")
    .order("name");

  const { data: models } = await supabase
    .from("models")
    .select("id, name, make_id")
    .order("name");

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5">
        <h1 className="font-pixel text-lg uppercase tracking-tight">
          New Build
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <NewBuildForm makes={makes ?? []} models={models ?? []} />
      </div>
    </main>
  );
}
