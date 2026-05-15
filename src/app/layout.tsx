import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Mira — a quiet place to think out loud", template: "%s · Mira" },
  description:
    "A private, thoughtful AI companion for reflection, journaling, and gentle conversation. Not a medical service.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
