import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

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
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
