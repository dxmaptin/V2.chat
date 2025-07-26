"use client"

import { useState } from "react"
import type { LanguageV2 } from "@/lib/i18n-v2"
import { translationsV2 } from "@/lib/i18n-v2"

interface FooterProps {
  lang: LanguageV2
}

export function Footer({ lang }: FooterProps) {
  const [currentYear] = useState(new Date().getFullYear())
  const t = translationsV2[lang]?.footer || translationsV2["zh-CN"].footer

  const partners = [
    {
      name: "DeepSeek",
      logo: "/images/deepseek-logo.png",
      url: "https://deepseek.com",
      description: {
        "zh-CN": "AI语言模型提供商",
        "zh-TW": "AI語言模型提供商",
        en: "AI Language Model Provider",
        ja: "AI言語モデルプロバイダー",
        es: "Proveedor de Modelo de Lenguaje AI",
      },
    },
    {
      name: "Tavily",
      logo: "/images/tavily-logo.png",
      url: "https://tavily.com",
      description: {
        "zh-CN": "搜索API服务",
        "zh-TW": "搜尋API服務",
        en: "Search API Service",
        ja: "検索APIサービス",
        es: "Servicio de API de Búsqueda",
      },
    },
    {
      name: "CryptoCompare",
      logo: "/images/cryptocompare-logo.jpeg",
      url: "https://www.cryptocompare.com",
      description: {
        "zh-CN": "加密货币数据提供商",
        "zh-TW": "加密貨幣數據提供商",
        en: "Cryptocurrency Data Provider",
        ja: "暗号通貨データプロバイダー",
        es: "Proveedor de Datos de Criptomonedas",
      },
    },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-6 py-16">
        {/* Partners Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.trustedPartners}</h3>
            <p className="text-gray-600 text-lg">{t.partnersSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-6 w-full"
                >
                  {/* Logo Container */}
                  <div className="w-20 h-20 flex items-center justify-center rounded-xl group-hover:bg-blue-50 transition-all duration-300 bg-transparent font-light">
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={`${partner.name} logo`}
                      className="w-14 h-14 object-contain opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const fallback = document.createElement("div")
                        fallback.className = "text-gray-700 font-bold text-2xl"
                        fallback.textContent = partner.name.charAt(0)
                        target.parentNode?.appendChild(fallback)
                      }}
                    />
                  </div>

                  {/* Partner Info */}
                  <div className="text-center">
                    <h4 className="text-gray-900 font-bold text-xl group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      {partner.name}
                    </h4>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                      {partner.description[lang] || partner.description["zh-CN"]}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-12"></div>

        {/* Copyright and Company Info */}
        <div className="text-center space-y-8">
          {/* Company Logo/Name */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center p-3 border border-gray-200">
              <img src="/v2-logo.png" alt="AI Agent Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900 text-center">    AI Agent</h2>
              <p className="text-gray-600 text-lg">{t.platformName}</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="space-y-4">
            <p className="text-gray-800 font-semibold text-xl">
              © {t.copyright} {currentYear}.
            </p>
            <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">{t.disclaimer}</p>
          </div>

          {/* Technical Info */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">{t.technicalInfo}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
