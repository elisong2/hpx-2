import { createClient } from "@/lib/supabase/server";
import AccountForm from "@/app/account/account-form";

// export default async function UserPage({
//   params,
// }: {
//   params: { username: string };
// }) {
//   const supabase = await createClient();

//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("username", params.username)
//     .single();

//   if (!profile) {
//     return <p>User not found</p>;
//   }

//   return (
//     <div>
//       <h1>test</h1>
//       <h1>{profile.username}</h1>
//       <p>{profile.bio}</p>
//     </div>
//   );
// }

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <AccountForm user={user} />
    </>
  );
}
