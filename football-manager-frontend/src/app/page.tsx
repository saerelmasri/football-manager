import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Football Team Manager</h1>
      <div className="space-y-4">
        <Link href="/auth">
          <Button variant="default" className="w-full font-semibold">Login / Register</Button>
        </Link>
      </div>
    </main>
  );
}
