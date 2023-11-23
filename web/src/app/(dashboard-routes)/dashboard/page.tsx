import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession(nextAuthOptions);

  return (
    <section className="flex flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-stone-50 text-4xl pb-4">
        Olá, {session?.user?.name}
      </h1>
    </section>
  );
}
