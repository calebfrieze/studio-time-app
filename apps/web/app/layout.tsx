import { Logo } from "@repo/ui/components/logo";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio Time",
  description: "A music studio booking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <nav className="flex justify-between items-center p-4">
          <Link href="/" className="size-12">
            <Logo />
          </Link>
          <div>
            <Link href="/account">My Sessions</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
