import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryClientProvider } from "@/provider/react-query";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { UserProvider } from "@/contexts/UserContext";
import ProgressProvider from "@/provider/progress-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
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
            <SpeedInsights />
          </ReactQueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
