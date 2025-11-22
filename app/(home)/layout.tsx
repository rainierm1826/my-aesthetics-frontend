import type { Metadata } from "next";
import Navbar from "@/components/navigations/Navbar";
import "./globals.css";
import Footer from "@/components/sections/Footer";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";
import { inter } from "@/components/fonts/fonts";
import { TokenRefreshProvider } from "@/provider/TokenRefreshProvider";
import FlowiseChatbot from "@/components/FlowiseChatbot";
import { SignModalProvider, SignModal } from "@/components/modals";

export const metadata: Metadata = {
  title: "MY Aesthetics Brow Studio",
  description:
    "MY Aesthetics Brow Studio — expert microblading, brow shaping, lamination, lash lifts, and permanent makeup for natural, long-lasting results. Book a personalized beauty treatment today.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
       <FlowiseChatbot/>
      </head>
      <body className={`${inter.className} `}>
        <QueryProvider>
          <SignModalProvider>
            <TokenRefreshProvider />
            <Navbar />
            <SignModal />
            <main>{children}</main>
            <Toaster />
            <Footer />
          </SignModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
