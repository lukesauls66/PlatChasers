import type { Metadata } from "next";
// import localFont from "next/font/local";
import Template from "@/components/Template";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "PlatChasers",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Template>{children}</Template>
        </SessionProvider>
      </body>
    </html>
  );
}
