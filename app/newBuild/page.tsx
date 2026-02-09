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
    <>
      <h2>Create New Build</h2>
      <div className="">
        <NewBuildForm makes={makes ?? []} models={models ?? []} />
      </div>
    </>
  );
}

// "use client";

// import { newBuildHelper } from "@/utils/helpers";

// export default function NewBuildPage() {
//   return (
//     <>
//       <div>
//         <h2>Create New Build</h2>
//       </div>

//       <form action={newBuildHelper}>
//         <div>
//           <label>Title</label>
//           <input type="text" name="title" required />
//         </div>

//         <div>
//           <label>Description</label>
//           <textarea name="description" required rows={5} />
//         </div>

//         <div>
//           <label>Upload Images</label>
//           <input type="file" name="image" accept="image/*" multiple required />
//         </div>

//         <button type="submit">Create Build</button>
//       </form>
//     </>
//   );
// }

// "use server";

// // import { useState } from "react";
// // import { useMutation } from '@tanstack/react-query';
// import { createClient } from "@/lib/supabase/server";

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

// export default async function NewBuildPage() {
//   return (
//     <>
//       <div>
//         <h2>Create New Build</h2>
//       </div>

//       <form action={newBuild}>
//         <div>
//           <label> Title </label>
//           <input type="text" id="title" name="title" required />
//         </div>

//         <div>
//           <label> Description </label>
//           <textarea id="description" name="description" required rows={5} />
//         </div>

//         <div>
//           <label> Upload Images </label>
//           <input
//             type="file"
//             id="image"
//             name="image"
//             accept="image*/"
//             multiple
//             required
//           />
//         </div>

//         <button type="submit">Create Build</button>
//       </form>
//     </>
//   );
// }

// //////////////
