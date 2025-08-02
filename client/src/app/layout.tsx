import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import Navbar from "./home/Navbar";
import WebSocketProvider from "@/components/providers/WebSocketProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConnectSphere",
  description: "The ultimate team collaboration platform designed to boost productivity and streamline communication in your organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSocketProvider>
          <Navbar />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster richColors theme="dark" />
          </ThemeProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
