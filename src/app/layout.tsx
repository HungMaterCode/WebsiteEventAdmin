import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Neon Heritage Festival | Bế Mạc Festival Ninh Bình 2024",
    template: "%s | Neon Heritage Festival",
  },
  description:
    "Sự kiện âm nhạc bế mạc Festival Ninh Bình 2024 - Dòng Chảy Di Sản. Nơi giao thoa giữa di sản văn hóa truyền thống và nghệ thuật đương đại tại Thung Nham, Ninh Bình.",
  keywords: [
    "Neon Heritage Festival",
    "Festival Ninh Bình",
    "Concert Ninh Bình",
    "Thung Nham",
    "Sự kiện âm nhạc",
    "Bế mạc Festival",
    "Countdown 2024",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Neon Heritage Festival",
    title: "Neon Heritage Festival | Dòng Chảy Di Sản",
    description:
      "Đêm nhạc bế mạc Festival Ninh Bình 2024 tại Thung Nham. Dàn line-up đỉnh cao, 3D Mapping, pháo hoa countdown.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
