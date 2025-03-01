import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <Card className="w-full max-w-md bg-bw">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* LARGE 404 TEXT */}
            <p className="text-8xl font-bold text-primary font-mono">404</p>

            {/* MESSAGE */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                User not found
              </h1>
              <p className="">The user you're looking for doesn't exist.</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="neutral" asChild>
                <Link href="/">
                  <Icons.HomeIcon className="mr-2 size-4" />
                  Back to Home
                </Link>
              </Button>

              <Button variant="default" asChild>
                <Link href="/">
                  <Icons.ArrowLeftIcon className="mr-2 size-4" />
                  Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
