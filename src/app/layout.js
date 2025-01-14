import { Nunito } from "next/font/google";
import { cn } from "../lib/utils";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import TrqProvider from "~/providers/trq/TrqProvider";

const nunito = Nunito({ subsets: ["latin"], weight: ["700", "600"] });

export const metadata = {
  // metadataBase: new URL(
  //   env.VERCEL_ENV === "production" ? "https://kg.org" : "http://localhost:3000"
  // ),
  title: "Lease App",
  description: "Lease App",
  openGraph: {
    title: "Lease App",
    description: "Lease App",
    url: "https://Lease.app",
    siteName: "Lease App",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-card text-primary-foreground antialiased",
          nunito.className
        )}
      >
        <TrqProvider>{children}</TrqProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
