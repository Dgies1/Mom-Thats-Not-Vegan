import type { Metadata } from "next";
import { Itim } from "next/font/google";
import "./globals.css";

const itim = Itim({
  weight: "400",
  subsets: ["latin"],

});

export const metadata: Metadata = {
  title: "Mom, That's Not Vegan",
  description: "Mom, That's Not Vegan is a chatbot that helps you determine if a food or beverage is vegan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${itim.className} sm:overflow-y-auto`}>{children}</body>
    </html>
  );
}
