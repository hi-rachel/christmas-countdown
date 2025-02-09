import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Christmas Countdown - How many days until Christmas?",
  description:
    "Check how many days until Christmas! Count down to the special moment with our real-time counter.",
  icons: {
    icon: [
      {
        url: "/tree.svg",
        type: "image/svg+xml",
      },
    ],
  },
  keywords: ["Christmas", "D-day", "크리스마스", "Christmas Countdown"],
  openGraph: {
    title: "Christmas Countdown",
    description: "How many days until Christmas?",
    url: "https://christmas-countdown-12-25.vercel.app/",
    type: "website",
    images: [
      {
        url: "/main.png",
        width: 1200,
        height: 630,
        alt: "Christmas Countdown",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Countdown",
    description: "How many days until Christmas?",
    site: "https://christmas-countdown-12-25.vercel.app/",
    images: "/main.png",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""}
      />
    </html>
  );
};

export default RootLayout;
