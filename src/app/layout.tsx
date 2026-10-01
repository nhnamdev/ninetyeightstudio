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
  metadataBase: new URL("https://wwyn.vn"),
  title: "WWYN – WEAR WHAT YOU NEED",
  description:
    "WWYN là local brand thời trang Việt Nam, mang phong cách streetwear trẻ trung, cá tính. Thiết kế hiện đại, chất lượng cao, dành cho giới trẻ yêu thời trang.",
  icons: {
    icon: "/sites/wwyn-vn/root/images/favicon.jpg",
  },
};

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
