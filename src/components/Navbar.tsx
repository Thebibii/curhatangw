import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import ButtonLogout from "./ButtonLogout";

async function Navbar() {
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
              MasalahgwV2
            </Link>
          </div>

          <SignedIn>
            <ButtonLogout />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="neutral">Login</Button>
            </SignInButton>
          </SignedOut>
          {/* <DesktopNavbar />
          <MobileNavbar /> */}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
