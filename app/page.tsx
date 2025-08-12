"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed Out Successfully");
        }
      }
    })
  }

  return (
    <div className="p-24">
      <Button>Hello, World!</Button>
      <ThemeToggle />

      {session ? (
        <>
          <p>{session.user.name}</p>
          <Button onClick={signOut}>Logout</Button>
        </>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </div>
  );
}
