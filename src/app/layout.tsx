import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Momo_Signature, Unbounded } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { WaveBackground } from "@/components/WaveBackground";
import { FloatingAssistant } from "@/components/FloatingAssistant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin", "cyrillic"],
});

const display = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
});

const signature = Momo_Signature({
  variable: "--font-momo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "4 your learning — изучение английского",
  description:
    "Изучай английский в игровой форме: 20 уровней, разбор ошибок, подготовка к ЕГЭ и IELTS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${jbMono.variable} ${display.variable} ${signature.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WaveBackground />
        {children}
        <FloatingAssistant />
        <Analytics />
      </body>
    </html>
  );
}
