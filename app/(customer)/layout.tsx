import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

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
          <main>{children}</main>
          <Toaster />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
