import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Sidebar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* Main Layout Container */}
          <div className="relative flex h-screen">
            {/* Sidebar */}
            <div className="flex-none w-64 border-r border-default-200">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto pr-50 pl-20">
              {/* Main Content */}
              <main className="container mx-auto max-w-full p-6 flex-grow">
                {children}
              </main>

              {/* Footer */}
              <footer className="w-full flex items-center justify-center py-3 border-t border-default-200">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href=" https://piiii31.github.io/My-Portfolio/ "
                  title="nextui.org homepage"
                >
                  <span className="text-default-600">Powered by</span>
                  <p className="text-primary">PIIII</p>
                </Link>
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
