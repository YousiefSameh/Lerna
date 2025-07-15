"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const HomePage = () => {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const signOutHandler = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
          toast.success("You Signed Out Successfully :)");
				},
			},
		});
	};
	return (
		<section className="p-24">
			<Button variant="default">Project Setup Successfully :)</Button>
			<ThemeToggle />
			{session ? (
				<>
					<p>{session.user.name}</p>
					<Button onClick={signOutHandler}>Sign Out</Button>
				</>
			) : (
				<Button onClick={() => router.push("/login")}>Login</Button>
			)}
		</section>
	);
};

export default HomePage;
