import type { Metadata } from "next";
//import "@/app/globals.css";
import { Providers } from "./providers"; // adjust path if your providers file is elsewhere

export const metadata: Metadata = {
  title: "DevPulse",
  description: "Engineering Productivity & Developer Analytics Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
