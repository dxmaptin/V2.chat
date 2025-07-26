"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight, X } from "lucide-react"
import type { LanguageV2 } from "@/lib/i18n-v2"
import { translationsV2 } from "@/lib/i18n-v2"

interface WelcomeModalProps {
  lang: LanguageV2
  onClose: () => void
}

export function WelcomeModal({ lang, onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const t = translationsV2[lang]?.welcomeModal || translationsV2["zh-CN"].welcomeModal

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("v2-welcome-seen")
    if (!hasSeenWelcome) {
      setTimeout(() => setIsVisible(true), 2000) // Show after 2 seconds
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % t.features.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isVisible, t.features.length])

  const handleGetStarted = () => {
    localStorage.setItem("v2-welcome-seen", "true")
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSkip = () => {
    localStorage.setItem("v2-welcome-seen", "true")
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`transform transition-all duration-700 ease-out ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <Card className="bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border-white/20 max-w-2xl w-full relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Close Button */}
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          <CardContent className="p-8 relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-3 shadow-2xl border border-white/20">
                  <img src="/v2-logo.png" alt="V2 Logo" className="w-full h-full object-contain" />
                </div>
                <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-lg text-blue-400 font-medium mb-4">{t.subtitle}</p>
              <p className="text-gray-300 leading-relaxed max-w-lg mx-auto">{t.description}</p>
            </div>

            {/* Animated Features */}
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 text-center">
                  {lang === "zh-CN" && "核心功能"}
                  {lang === "zh-TW" && "核心功能"}
                  {lang === "en" && "Core Features"}
                  {lang === "ja" && "コア機能"}
                  {lang === "es" && "Características Principales"}
                </h3>

                <div className="space-y-3">
                  {t.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                        index === currentFeature
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 scale-105"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <span className="text-2xl">{feature.split(" ")[0]}</span>
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          index === currentFeature ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {feature.substring(feature.indexOf(" ") + 1)}
                      </span>
                      {index === currentFeature && (
                        <ArrowRight className="h-4 w-4 text-blue-400 ml-auto animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t.getStarted}
              </Button>

              <Button
                onClick={handleSkip}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-3 transition-all duration-300"
              >
                {t.skipIntro}
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {t.features.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFeature ? "bg-blue-400 scale-125" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
