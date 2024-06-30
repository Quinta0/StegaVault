"use client"

import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

interface IconProps {
  className?: string;
}

const LockIcon: React.FC<IconProps> = (props) => {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
};

const MenuIcon: React.FC<IconProps> = (props) => {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
};

const NavBar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link href="#" className="flex items-center justify-center" prefetch={false}>
        <LockIcon className="h-6 w-6" />
        <span className="sr-only">Steganography App</span>
      </Link>
      <Link href="/" className="text-xl font-bold">
        StegaVault
      </Link>
      <div className="ml-auto flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
            <nav className="grid gap-4 ">
              <Link href="#" className="self-center text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                Features
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                About
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                Contact
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                Dashboard
              </Link>
              {!isLoggedIn ? (
                <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                  Login
                </Link>
              ) : (
                <Button onClick={logout} className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                  Logout
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden lg:flex gap-4 sm:gap-6 place-items-center">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Dashboard
          </Link>
          {!isLoggedIn ? (
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Login
            </Link>
          ) : (
            <Button onClick={logout} className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
