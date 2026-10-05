import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Ninety Eight Studio",
  description:
    "Ninety Eight Studio là local brand thời trang Việt Nam, mang phong cách streetwear trẻ trung, cá tính. Thiết kế hiện đại, chất lượng cao, dành cho giới trẻ yêu thời trang.",
  icons: {
    icon: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/favicon-c046f090.png",
    shortcut: "/favicon.ico",
    apple: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/favicon-c046f090.png",
  },
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
