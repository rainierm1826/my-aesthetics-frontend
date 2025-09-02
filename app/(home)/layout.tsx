import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "../globals.css";
import Footer from "@/components/Footer";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";
import {inter} from "@/components/fonts/fonts"


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
