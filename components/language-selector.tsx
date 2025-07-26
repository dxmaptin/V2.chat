"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Languages, ChevronDown } from "lucide-react"
import type { LanguageV2 } from "@/lib/i18n-v2"

interface LanguageSelectorProps {
  value: LanguageV2
  onValueChange: (value: LanguageV2) => void
}

const languageOptions = [
  { value: "zh-CN" as LanguageV2, label: "中文简体", flag: "🇨🇳" },
  { value: "zh-TW" as LanguageV2, label: "繁體中文", flag: "🇹🇼" },
  { value: "en" as LanguageV2, label: "English", flag: "🇺🇸" },
  { value: "ja" as LanguageV2, label: "日本語", flag: "🇯🇵" },
  { value: "es" as LanguageV2, label: "Español", flag: "🇪🇸" },
]

export function LanguageSelector({ value, onValueChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = languageOptions.find((lang) => lang.value === value)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/50 border-white/30 text-white hover:bg-black/70 hover:border-white/50 transition-all duration-200 min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLanguage?.flag}</span>
          <span className="text-sm">{currentLanguage?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* 下拉菜单 */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onValueChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-150 flex items-center gap-3 ${
                  value === option.value ? "bg-white/20 text-white" : "text-gray-200"
                }`}
              >
                <span className="text-lg">{option.flag}</span>
                <span className="text-sm font-medium">{option.label}</span>
                {value === option.value && <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
