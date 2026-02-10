import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seed Journal",
  description: "Local-first mental health buddy with seed growth journaling"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
