import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pace University - Course Equivalencies",
  description: "Find your pre-approved foreign course equivalencies that transfer to Pace University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
