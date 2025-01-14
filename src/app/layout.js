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
  title: "Insurance Reminder System",
  description: "Insurance Reminder System",
  openGraph: {
    title: "Insurance Reminder System",
    description: "Insurance Reminder System",
    url: "https://kg.app",
    siteName: "Insurance Reminder System",
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
