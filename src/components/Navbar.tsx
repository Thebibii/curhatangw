"use client";
import { SignedIn, SignedOut, SignIn, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sign } from "crypto";

function Navbar() {
  const { signOut } = useClerk();
  /* if (user) await syncUser(); // POST */

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              Socially
            </Link>
          </div>

          <SignedIn>
            <Button
              variant="neutral"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              Logout
            </Button>
          </SignedIn>
          <SignedOut>
            <Button
              variant="neutral"
              onClick={() => SignIn({ redirectUrl: "/" })}
            >
              Logout
            </Button>
          </SignedOut>
          {/* <DesktopNavbar />
          <MobileNavbar /> */}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
