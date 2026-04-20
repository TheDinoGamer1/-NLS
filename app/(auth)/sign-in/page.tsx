import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Welcome to ChatPear</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue.</p>
        <SignInForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Need an account? <Link href="/sign-up" className="text-foreground underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
