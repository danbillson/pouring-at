import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Archivo_Narrow } from "next/font/google";
import "./globals.css";

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pouring at",
  description: "Find your favourite beers near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivoNarrow.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
