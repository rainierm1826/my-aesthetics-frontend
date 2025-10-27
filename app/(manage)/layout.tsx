import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigations/AppSidebar";
import "./globals.css";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { TokenRefreshProvider } from "@/provider/TokenRefreshProvider";

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
          <TokenRefreshProvider />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
            <Toaster />
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
