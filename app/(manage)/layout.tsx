import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigations/AppSidebar";
import "./globals.css";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { TokenRefreshProvider } from "@/provider/TokenRefreshProvider";
import { WebSocketProvider } from "@/provider/WebSocketProvider";
import { SignModalProvider, SignModal } from "@/components/modals";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MY Aesthetics Brow Studio - Management",
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
      <body className={`${inter.className}`}>
        <QueryProvider>
          <SignModalProvider>
            <WebSocketProvider>
              <TokenRefreshProvider />
              <SidebarProvider>
                <AppSidebar />
                <SignModal />
                <SidebarInset>{children}</SidebarInset>
                <Toaster />
              </SidebarProvider>
            </WebSocketProvider>
          </SignModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
