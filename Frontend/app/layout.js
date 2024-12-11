import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Electricity Load Forecasting",
  description: "Smart electricity load forecasting and analysis system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-neutral-950">
          {children}
        </main>
      </body>
    </html>
  );
}
