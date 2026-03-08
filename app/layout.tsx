import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" });

export const metadata: Metadata = {
  title: "MedSalary Check | 医療従事者向け年収診断",
  description:
    "看護師・薬剤師・理学療法士などの医療従事者が自分の年収を市場相場と比較できる無料診断ツール。転職・交渉の判断材料に。",
  openGraph: {
    title: "MedSalary Check | 医療従事者向け年収診断",
    description: "あなたの年収は市場相場と比べてどうですか？無料で3分診断。",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="antialiased bg-slate-50 text-slate-800 font-sans">{children}</body>
    </html>
  );
}
