import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import { Open_Sans } from 'next/font/google'
 
const openSans = Open_Sans({
  weight: ["300", "400", "700"],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Modern Connect External Login",
  description: "Modern Connect by Modern Dental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans} antialiased`}>
        <AppRouterCacheProvider>
          <Header />
          <main className="">{children}</main>
          <Footer />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
