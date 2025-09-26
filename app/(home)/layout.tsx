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
        <Script id="flowise-chatbot" strategy="afterInteractive">
          {`
            import('https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js').then((module) => {
              const Chatbot = module.default;
              Chatbot.init({
                chatflowid: "c51586a9-ad8a-4377-a25c-8a9c0151a6ea",
                apiHost: "https://cloud.flowiseai.com",
              });
            });
          `}
        </Script>
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
