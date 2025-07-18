"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [ pendingGithub, startGithubTransition ] = useTransition();
    const signInWithGithub = async () => {
      startGithubTransition(async () => {
        await authClient.signIn.social({ provider: "github", callbackURL: "/", fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, You will be redirected ...")
          },
          onError: () => {
            toast.error("Internal Error 500")
          }
        } });
      })
    };
  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Welcome back!</CardTitle>
          <CardDescription>Login with your Github Email account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button disabled={pendingGithub} onClick={signInWithGithub} variant="outline" className="w-full">
            {pendingGithub ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading ...</span>
              </>
            ) : (
              <>
                <GithubIcon className="size-4" />
                Sign in with Github
              </>
            )}
          </Button>
  
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border ">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
  
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" />
            </div>
            <Button>Continue With Email</Button>
          </div>
        </CardContent>
      </Card>
    );
}