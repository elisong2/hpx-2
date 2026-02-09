"use server";
// app/components/NavbarDynamic.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import SignOutButton from "@/app/components/SignOutButton"; // direct import!
import SignOutButtonWrapper from "./SignOutButtonWrapper";
import LoginButton from "./LoginLogoutButton";

export default async function NavbarDynamic() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single();

    username = data?.username;
  }

  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <Link className="btn btn-ghost text-xl" href="/">
        Home
      </Link>
      <Link className="btn btn-ghost text-xl" href="/completedBuilds">
        Gallery
      </Link>
      <Link className="btn btn-ghost text-xl" href="/guides">
        Guides
      </Link>
      <Link className="btn btn-ghost text-xl" href="/parts">
        Parts
      </Link>

      <Link className="btn btn-ghost text-xl" href="/about">
        About
      </Link>
    </nav>
  );
}

// return (
//   <nav className="navbar bg-base-100">
//     <Link href="/" className="btn btn-ghost text-xl">
//       MyApp
//     </Link>
//     <div className="ml-auto">
//       {user ? (
//         <div className="flex items-center gap-2">
//           <span className="text-sm">{user.email}</span>
//           <SignOutButton />
//         </div>
//       ) : (
//         <>
//           <Link className="btn btn-ghost text-l" href="/account/login">
//             Login
//           </Link>
//           <Link className="btn btn-ghost text-l" href="/account/signup">
//             Sign Up
//           </Link>
//         </>
//       )}
//     </div>
//   </nav>
// );

// import { createClient } from "@/lib/supabase/server";
// import Link from "next/link";
// import dynamic from "next/dynamic";
// import SignOutButtonWrapper from "@/app/components/SignOutButtonWrapper";

// export default async function NavbarDynamic() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   let username = null;

//   if (user) {
//     const { data } = await supabase
//       .from("profiles")
//       .select("username")
//       .eq("user_id", user.id)
//       .single();

//     username = data?.username;
//   }

// return (
//   <nav className="navbar bg-base-100 shadow-sm">
//     <Link className="btn btn-ghost text-xl" href="/">
//       Home
//     </Link>
//     <Link className="btn btn-ghost text-xl" href="/completedBuilds">
//       Builds
//     </Link>
//     <Link className="btn btn-ghost text-xl" href="/guides">
//       Guides
//     </Link>
//     <Link className="btn btn-ghost text-xl" href="/about">
//       About
//     </Link>

//     <div>
//       {!user ? (
//         <>
//           <Link className="btn btn-ghost text-l" href="/account/login">
//             Login
//           </Link>
//           <Link className="btn btn-ghost text-l" href="/account/signup">
//             Sign Up
//           </Link>
//         </>
//       ) : (
//         <>
//           <Link className="btn btn-ghost text-l" href={`/user/${username}`}>
//             My Profile
//           </Link>
//           <SignOutButtonWrapper /> {/* client-side button */}
//         </>
//       )}
//     </div>
//   </nav>
// );
// }

// "use server";

// import { createClient } from "@/lib/supabase/server";
// import Link from "next/link";

// export default async function NavbarDynamic() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   // console.log(user);
//   let username = null;

//   if (user) {

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("username")
//       .eq("user_id", user.id)
//       .single();

//     username = data?.username;

//   }

//   return (
//     <nav className="navbar bg-base-100 shadow-sm">
//       <Link className="btn btn-ghost text-xl" href="/">
//         Home
//       </Link>
//       <Link className="btn btn-ghost text-xl" href="/completedBuilds">
//         Builds
//       </Link>
//       <Link className="btn btn-ghost text-xl" href="/guides">
//         Guides
//       </Link>

//       <Link className="btn btn-ghost text-l" href="/about">
//         About
//       </Link>

//       <div>
//         {!user ? (
//           <>
//             <Link className="btn btn-ghost text-l" href="/account/login">
//               Login
//             </Link>
//             <Link className="btn btn-ghost text-l" href="/account/signup">
//               Sign Up
//             </Link>
//           </>
//         ) : (
//           <>
//             <Link
//               className="btn btn-ghost text-l"
//               // href={`/${user.user_metadata.username || "account"}`}
//               href={`/user/${username}`}
//             >
//               My Profile
//             </Link>

//             <form
//               className="btn btn-ghost text-l"
//               action="/auth/signout"
//               method="post"
//             >
//               <button type="submit" className="cursor-pointer">
//                 Sign Out
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import { createBrowserClient } from "@supabase/ssr";
// import Link from "next/link";

// export default function NavbarDynamic() {
//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
//   );

//   const [user, setUser] = useState<any>(null);
//   const [username, setUsername] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setUser(user);
//       if (user) {
//         const { data } = await supabase
//           .from("profiles")
//           .select("username")
//           .eq("user_id", user.id)
//           .single();
//         setUsername(data?.username ?? null);
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, []);

//   return (
//     <nav className="navbar bg-base-100 shadow-sm">
//       <Link className="btn btn-ghost text-xl" href="/">
//         Home
//       </Link>
//       {!user ? (
//         <>
//           <Link className="btn btn-ghost text-l" href="/account/login">
//             Login
//           </Link>
//           <Link className="btn btn-ghost text-l" href="/account/signup">
//             Sign Up
//           </Link>
//         </>
//       ) : loading ? (
//         <span className="btn btn-ghost text-l opacity-50">Loading...</span>
//       ) : username ? (
//         <Link className="btn btn-ghost text-l" href={`/user/${username}`}>
//           My Profile
//         </Link>
//       ) : (
//         <span className="btn btn-ghost text-l text-error">No username</span>
//       )}
//     </nav>
//   );
// }
