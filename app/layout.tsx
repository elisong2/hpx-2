import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, Space_Mono } from "next/font/google";
import "./globals.css";

import React from "react";
import Link from "next/link";
import NavbarDynamic from "./components/navbar";
import SupabaseAuthListener from "./components/authlistener";
import LoginButton from "./components/LoginLogoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HPX-2",
  description: "PCPartPicker for cars!",
  openGraph: {
    title: "HPX-2 Home Page",
    description: "PCPartPicker for cars!",
    url: "https://hpx2.vercel.app/",
    siteName: "HPX-2",
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="retro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} ${spaceMono.variable} antialiased`}
      >
        <NavbarDynamic />
        {/* <LoginButton /> */}
        {/* <SupabaseAuthListener /> */}
        {children}

        <footer className="flex items-center">Temp footer</footer>
      </body>
    </html>
  );
}
