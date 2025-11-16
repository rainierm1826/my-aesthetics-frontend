import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/sections/Footer";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";
import { inter } from "@/components/fonts/fonts";
import { TokenRefreshProvider } from "@/provider/TokenRefreshProvider";
import { WebSocketProvider } from "@/provider/WebSocketProvider";
import FlowiseChatbot from "@/components/FlowiseChatbot";

export const metadata: Metadata = {
  title: "MY Aesthetics Brow Studio",
  description: "",
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
        <FlowiseChatbot />
      </head>
      <body className={`${inter.className} `}>
        <QueryProvider>
          <WebSocketProvider>
            <TokenRefreshProvider />
            <main>{children}</main>
            <Toaster />
            <Footer />
          </WebSocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
