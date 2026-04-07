import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Press_Start_2P,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

import React from "react";
import NavbarDynamic from "./components/navbar";
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
        <div className="te-border-thick border-t-0 border-l-0 border-r-0 flex items-center justify-between">
          <NavbarDynamic />
          <div className="px-6">
            <LoginButton />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
