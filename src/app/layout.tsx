import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryClientProvider } from "@/lib/react-query";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { UserProvider } from "@/contexts/UserContext";
import ProgressProvider from "@/components/provider/progress-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <ReactQueryClientProvider>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <UserProvider>
              <ProgressProvider>
                <div className="min-h-screen">
                  <Navbar />

                  <main className="py-8">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="hidden lg:block lg:col-span-3">
                          <Sidebar />
                        </div>
                        <div className="lg:col-span-9">{children}</div>
                      </div>
                    </div>
                  </main>
                </div>
              </ProgressProvider>
            </UserProvider>
            <Toaster />
          </ReactQueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
