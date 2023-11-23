import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/logoutButton";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession(nextAuthOptions);
  console.log('Session:', session?.user);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-stone-50 text-4xl pb-4">Olá, {session?.user?.name}</h1>
      
      <LogoutButton />
    </section>
  );
}
