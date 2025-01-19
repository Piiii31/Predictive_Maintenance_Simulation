'use client'
import { Providers } from "@/app/providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, [router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <html suppressHydrationWarning lang="en" className="dark">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          " dark:text-white", // Added dark mode styles
          fontSans.variable
        )}
      >
        <Providers>
          <section className="dark">
            <main className="min-h-screen flex flex-col">{children}</main>
          </section>
        </Providers>
      </body>
    </html>
  );
}