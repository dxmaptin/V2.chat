import type React from "react"
import type { Metadata } from "next"
import { Inter, Sankofa_Display as SF_Pro_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const sfPro = SF_Pro_Display({
  subsets: ["latin"],
  variable: "--font-sf-pro",
  // Sankofa Display only provides 400; requesting others breaks the build
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "V2 AI Agent",
  description: "加密货币智能预测平台 - 基于AI的价格预测和市场分析",
  keywords: ["加密货币", "AI预测", "比特币", "以太坊", "价格预测", "市场分析", "区块链"],
  authors: [{ name: "V2 AI Team" }],
  creator: "V2 AI Agent",
  publisher: "V2 AI Platform",
  robots: "index, follow",
  openGraph: {
    title: "V2 AI Agent - 加密货币智能预测平台",
    description: "基于深度学习和大数据分析，为您提供最精准的加密货币价格预测和市场洞察",
    url: "https://v2-ai-agent.com",
    siteName: "V2 AI Agent",
    images: [
      {
        url: "/v2-logo.png",
        width: 1200,
        height: 630,
        alt: "V2 AI Agent Logo",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "V2 AI Agent - 加密货币智能预测平台",
    description: "基于深度学习和大数据分析，为您提供最精准的加密货币价格预测和市场洞察",
    images: ["/v2-logo.png"],
    creator: "@V2AIAgent",
  },
  icons: {
    icon: "/v2-logo.png",
    shortcut: "/v2-logo.png",
    apple: "/v2-logo.png",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${sfPro.variable}`}>
      <head>
        {/* 额外的favicon设置 */}

        {/* PWA相关 */}
        <meta name="application-name" content="V2 AI Agent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="V2 AI Agent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/v2-logo.png" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* 预加载关键资源 */}
        <link rel="preload" href="/v2-logo.png" as="image" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>{children}</body>
    </html>
  )
}
