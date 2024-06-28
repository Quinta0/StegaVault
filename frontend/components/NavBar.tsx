import Link from 'next/link'
import { ModeToggle } from './mode-toggle'

const NavBar = () => {
  return (
    <nav className="bg-primary text-background p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">StegaVault</Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Login/Signup</Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default NavBar