import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Navbar />
            <main className="min-h-screen px-4 py-12 sm:py-16 md:py-24 bg-background text-main-text flex flex-col justify-center items-center gap-6 md:flex-row md:gap-12 lg:gap-16">
              <div className='w-full md:w-1/2 flex flex-col justify-start items-center gap-5'>
                {children}
              </div>
            </main>
            <Footer />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider >
  );
}
