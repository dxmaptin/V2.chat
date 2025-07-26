"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, ExternalLink } from "lucide-react"
import type { LanguageV2 } from "@/lib/i18n-v2"
import { translationsV2 } from "@/lib/i18n-v2"

interface RiskDisclosureBannerProps {
  lang: LanguageV2
}

export function RiskDisclosureBanner({ lang }: RiskDisclosureBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const t = translationsV2[lang]?.riskDisclosure || translationsV2["zh-CN"].riskDisclosure

  useEffect(() => {
    const hasSeenDisclosure = localStorage.getItem("v2-risk-disclosure-seen")
    if (!hasSeenDisclosure) {
      setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)
      }, 1000) // Show after 1 second delay
    }
  }, [])

  const handleDismiss = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem("v2-risk-disclosure-seen", "true")
    }, 300)
  }

  const handleLearnMore = () => {
    // You can implement a link to detailed risk disclosure page
    window.open("#risk-details", "_blank")
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transform transition-all duration-500 ease-out ${
        isAnimating ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-gradient-to-r from-red-600/95 via-red-500/95 to-orange-500/95 backdrop-blur-md border-b border-red-400/30 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Icon and Content */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm md:text-base mb-1">{t.title}</h3>
                <p className="text-white/90 text-xs md:text-sm leading-relaxed">{t.content}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handleLearnMore}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
              >
                <ExternalLink className="h-3 w-3" />
                {t.learnMore}
              </Button>

              <Button
                onClick={handleDismiss}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-200"
              >
                {t.dismiss}
              </Button>

              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
