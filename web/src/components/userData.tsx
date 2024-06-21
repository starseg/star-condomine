"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: String;
  username: String;
  type: String;
}

export default function UserData() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    setUser(session?.payload.user);
  }, [session]);
  return (
    <div>
      <p className="text-primary text-lg px-12">
        Olá, {user && user.name.split(" ")[0]}
      </p>
    </div>
  );
}
