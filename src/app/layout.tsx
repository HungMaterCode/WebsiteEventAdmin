import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Toaster } from 'sonner';
import "./globals.css";


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

import { getSystemSettings } from "./admin/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings();
  const siteName = settings.siteName || "Neon Heritage Festival";
  const slogan = settings.slogan || "Bế Mạc Festival Ninh Bình 2024";
  const description = settings.seoDescription || "Sự kiện âm nhạc bế mạc Festival Ninh Bình 2024 - Dòng Chảy Di Sản.";
  const ogImageUrl = settings.ogImageUrl || "/og-image.jpg";
  const faviconUrl = settings.faviconUrl || "/favicon.ico";

  return {
    title: {
      default: `${siteName} | ${slogan}`,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: [
      siteName,
      "Festival Ninh Bình",
      "Concert Ninh Bình",
      "Thung Nham",
      "Sự kiện âm nhạc",
      "Bế mạc Festival",
      "Countdown 2024",
    ],
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: siteName,
      title: `${siteName} | ${slogan}`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>

      </body>

    </html>
  );
}
