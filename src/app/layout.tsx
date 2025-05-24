import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "./components/providers/StarknetProvider";

export const metadata: Metadata = {
  title: "Stack Sats Smarter | Vault Manager",
  description:
    "Earn yield on your BTC and borrow USDC with dynamic risk protection, powered by Pragma + Vesu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="/fonts/inter.css" />
      </head>
      <body className="bg-gray-900 text-white">
        <StarknetProvider>
          {children}
        </StarknetProvider>
      </body>
    </html>
  );
}
