import type { Metadata } from "next";
import Navbar from "@/components/navigations/Navbar";
import "./globals.css";
import Footer from "@/components/sections/Footer";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";
import { inter } from "@/components/fonts/fonts";
import Script from "next/script";

export const metadata: Metadata = {
  title: "MY Aesthetics Brow Studio",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://files.bpcontent.cloud/2025/09/26/04/20250926043030-53EYRCB8.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} `}>
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
