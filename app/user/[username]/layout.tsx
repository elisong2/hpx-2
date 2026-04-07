import UserSidebar from "@/app/components/UserSidebar";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <main className="min-h-screen">
      {/* Page header */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5 flex items-center justify-between">
        <h1 className="font-pixel text-lg tracking-tight uppercase">
          Account
        </h1>
      </div>

      <div className="flex">
        <UserSidebar username={username} />
        <section className="flex-1 p-6">{children}</section>
      </div>
    </main>
  );
}
