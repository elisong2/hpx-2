import { redirect } from "next/navigation";

export default async function AccountOverview({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Default landing redirects to profile
  redirect(`/user/${username}/profile`);
}
