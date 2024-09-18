import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/Vazirmatn.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "منو آنلاین",
  description: "منو آنلاین توسط ویمنو",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className={inter.className}>
        <div id="main-page" className="masthead">
        {children}
        </div>
      </body>
    </html>
  );
}
