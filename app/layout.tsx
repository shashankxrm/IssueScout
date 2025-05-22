import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "IssueScout | Find beginner-friendly open-source issues, faster.",
  description: "Discover beginner-friendly open source issues to contribute to on GitHub",
  icons: {
    icon: { 
      url: "/issuescout-big.png",
      sizes: "64x64", 
      type: "image/png" 
    },
    shortcut: [
      { url: "/issuescout-big.png", sizes: "64x64", type: "image/png" }
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
  },
  manifest: "/site.webmanifest"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`} suppressHydrationWarning> 
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
