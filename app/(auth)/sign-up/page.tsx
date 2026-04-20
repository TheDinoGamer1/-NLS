import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Create your ChatPear account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start chatting in under a minute.</p>
        <SignUpForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link href="/sign-in" className="text-foreground underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
