import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/sections/Footer";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";
import { inter } from "@/components/fonts/fonts";
import { TokenRefreshProvider } from "@/provider/TokenRefreshProvider";
import { WebSocketProvider } from "@/provider/WebSocketProvider";
import FlowiseChatbot from "@/components/FlowiseChatbot";
import { SignModalProvider, SignModal } from "@/components/modals";

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
          <SignModalProvider>
            <WebSocketProvider>
              <TokenRefreshProvider />
              <SignModal />
              <main>{children}</main>
              <Toaster />
              <Footer />
            </WebSocketProvider>
          </SignModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
