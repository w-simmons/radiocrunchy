import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import { GrainField } from "@/components/grain/GrainField";
import { copy } from "@/lib/brand";
import "./globals.css";

const host = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://radiocrunchy.com"),
  title: {
    default: "Radio Crunchy",
    template: "%s · Radio Crunchy",
  },
  description: copy.tagline,
  applicationName: "Radio Crunchy",
  authors: [{ name: "Radio Crunchy" }],
  keywords: ["Radio Crunchy", "GoVela", "Stud"],
  openGraph: {
    title: "Radio Crunchy",
    description: copy.tagline,
    type: "website",
    locale: "en_US",
    siteName: "Radio Crunchy",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${host.variable} h-full bg-ink antialiased`}>
      <body className="min-h-full bg-ink font-sans text-rice">
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-rice"
        >
          Skip to work
        </a>
        <GrainField />
        {children}
      </body>
    </html>
  );
}
