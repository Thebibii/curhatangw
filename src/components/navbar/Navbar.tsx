import Link from "next/link";
import PopoverProfile from "./PopoverProfile";
import { Button } from "../ui/button";
import { Icons } from "../icons";

function Navbar() {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              CurhatanGw
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="neutral"
              className=" items-center gap-2   hidden sm:flex"
              asChild
            >
              <Link href="/">
                <Icons.HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            <PopoverProfile />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
