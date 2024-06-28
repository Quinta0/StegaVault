import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to StegaVault</h1>
      <p className="text-xl mb-8">Secure password management with steganography</p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/login">Login / Sign Up</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </main>
  )
}