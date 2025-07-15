import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import Image from "next/image"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center">
      <Link href="/" className={buttonVariants({
        variant: "outline",
        className: "absolute top-4 left-4"
      })}>
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <section className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex itmes-center gap-2 self-center font-medium">
          <Image src="/logo.svg" alt="Lerna Logo" width={26} height={26} />
          Lerna
        </Link>
        {children}
        <p className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our <span className="hover:text-primary hover:underline transition-all">Terms Of Service</span> and <span className="hover:text-primary hover:underline transition-all">Privacy Policy</span>.
        </p>
      </section>
    </main>
  )
}

export default AuthLayout