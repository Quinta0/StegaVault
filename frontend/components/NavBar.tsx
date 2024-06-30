import Link from 'next/link'
import {ModeToggle} from './mode-toggle'

// LockIcon component
function LockIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
  )
}

const NavBar = () => {
  return (
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <LockIcon className="h-6 w-6"/>
          <span className="sr-only">Steganography App</span>
        </Link>
        <Link href="/" className="text-xl font-bold">StegaVault</Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}>Dashboard</Link>
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}>Login/Signup</Link>
          <ModeToggle/>
        </nav>
      </header>
  )
}


export default NavBar