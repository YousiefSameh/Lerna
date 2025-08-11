"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div
          onClick={() => router.replace('/')}
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src={Logo}
            alt="Lerna Logo"
            width={32}
            height={32}
            className="w-[32px] h-[32px]"
          />
          Lerna.
        </div>
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground">By clicking continue, you agree to our <span className="hover:text-primary hover:underline">Terms of service</span> and <span className="hover:text-primary hover:underline">Privacy Policy</span>.</div>
      </div>
    </div>
  );
}