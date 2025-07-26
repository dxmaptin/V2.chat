"use client"

import { useState, useEffect } from "react"
import type { LanguageV2 } from "@/lib/i18n-v2"

interface WifiIndicatorProps {
  isConnected: boolean
  isLoading: boolean
  lang?: LanguageV2
}

export function WifiIndicator({ isConnected, isLoading, lang = "zh-CN" }: WifiIndicatorProps) {
  const [animationPhase, setAnimationPhase] = useState(0)

  // 多语言文本
  const getText = (key: string) => {
    const texts = {
      connecting: {
        "zh-CN": "连接中...",
        "zh-TW": "連接中...",
        en: "Connecting...",
        ja: "接続中...",
        es: "Conectando...",
      },
      connectionFailed: {
        "zh-CN": "连接失败",
        "zh-TW": "連接失敗",
        en: "Connection Failed",
        ja: "接続失敗",
        es: "Conexión Fallida",
      },
      realTimeConnection: {
        "zh-CN": "实时连接",
        "zh-TW": "即時連接",
        en: "Real-time Connected",
        ja: "リアルタイム接続",
        es: "Conectado en Tiempo Real",
      },
    }

    return texts[key]?.[lang] || texts[key]?.["zh-CN"] || key
  }

  useEffect(() => {
    if (isConnected && !isLoading) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 1) % 3)
      }, 800)
      return () => clearInterval(interval)
    }
  }, [isConnected, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-end gap-0.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 bg-yellow-400 rounded-sm animate-pulse"
              style={{
                height: `${(i + 1) * 4}px`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-yellow-400 ml-1">{getText("connecting")}</span>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-end gap-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1 bg-red-400 rounded-sm" style={{ height: `${(i + 1) * 4}px` }} />
          ))}
        </div>
        <span className="text-xs text-red-400 ml-1">{getText("connectionFailed")}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1 rounded-sm transition-all duration-300 ${
              animationPhase >= i ? "bg-green-400" : "bg-green-400/30"
            }`}
            style={{ height: `${(i + 1) * 4}px` }}
          />
        ))}
      </div>
      <span className="text-xs text-green-400 ml-1">{getText("realTimeConnection")}</span>
    </div>
  )
}
