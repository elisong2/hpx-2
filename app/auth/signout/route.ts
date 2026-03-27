import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  // This clears the Supabase session cookies on the server
  await supabase.auth.signOut();

  // Return 200 OK
  return NextResponse.json({ success: true });
}


// 'use client';

// import { createClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
// import { type NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const supabase = await createClient();

//   // Check if a user's logged in
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (user) {
//     await supabase.auth.signOut();
//   }

//   revalidatePath("/", "layout");
//   return NextResponse.redirect(new URL("/", req.url), {
//     status: 302,
//   });
// }

// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { NextResponse, type NextRequest } from 'next/server'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'

// export async function POST(req: NextRequest) {
//   // const cookieStore = await cookies()

//   // const supabase = createServerClient(
//   //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   //   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//   //   {
//   //     cookies: {
//   //       getAll: () => cookieStore.getAll(),
//   //       setAll: (cookiesToSet) => {
//   //         cookiesToSet.forEach(({ name, value, options }) =>
//   //           cookieStore.set(name, value, options)
//   //         )
//   //       },
//   //     },
//   //   }
//   // )

//   // await supabase.auth.signOut()

//   // const redirectUrl = new URL('/', req.url)
//   // return NextResponse.redirect(redirectUrl, { status: 302 })
//   const supabase = await createClient();
//   const router = useRouter();
//   await supabase.auth.signOut();
//   router.refresh();
// }
