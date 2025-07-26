"use client"

import type React from "react"

import { useState } from "react"
import { useCompletion } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Languages, TrendingUp, TrendingDown } from "lucide-react"
import { translationsV2, type LanguageV2 } from "@/lib/i18n-v2"

interface Prediction {
  price: number
  confidence: number
}

const trending = [
  { symbol: "BTC", name: "Bitcoin", icon: "/placeholder.svg?width=40&height=40", pct: 2.5 },
  { symbol: "ETH", name: "Ethereum", icon: "/placeholder.svg?width=40&height=40", pct: -1.2 },
  { symbol: "SOL", name: "Solana", icon: "/placeholder.svg?width=40&height=40", pct: 5.8 },
]

export function CryptoPredictorV2() {
  const [lang, setLang] = useState<LanguageV2>("en")
  const t = translationsV2[lang]

  const [symbol, setSymbol] = useState("")
  const [pred, setPred] = useState<Prediction | null>(null)

  const { complete, isLoading } = useCompletion({
    api: "/api/predict",
    onFinish: (_, data) => {
      try {
        setPred(JSON.parse(data))
      } catch {
        setPred(null)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol) return
    setPred(null)
    complete(`Predict the price of ${symbol}`)
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-gray-50 to-gray-300 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Frosted-glass card */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <Bot className="h-5 w-5 text-gray-300" />
            {t.cardTitle}
          </CardTitle>

          {/* Language selector */}
          <Select value={lang} onValueChange={(v) => setLang(v as LanguageV2)}>
            <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-gray-200">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 text-gray-100 border-white/20">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh-CN">中文</SelectItem>
              <SelectItem value="zh-TW">繁體中文</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="predict" className="w-full">
            <TabsList className="grid grid-cols-2 bg-white/10 border-white/20">
              <TabsTrigger value="predict">{t.predictorTab}</TabsTrigger>
              <TabsTrigger value="trend">{t.leaderboardTab}</TabsTrigger>
            </TabsList>

            {/* Predictor tab */}
            <TabsContent value="predict" className="mt-4 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder={t.inputPlaceholder}
                  className="bg-white/10 border-white/20 text-gray-100 placeholder:text-gray-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !symbol}
                  className="w-full bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.25)] hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all"
                >
                  {isLoading ? t.predictingButton : t.predictButton}
                </Button>
              </form>

              {pred && (
                <div className="text-center space-y-1">
                  <p className="text-gray-400">{t.predictedPrice}</p>
                  <p className="text-2xl font-bold text-gray-50">${pred.price}</p>
                  <p className="text-gray-400">
                    {t.confidence}: {(pred.confidence * 100).toFixed(1)}&#37;
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Leaderboard tab */}
            <TabsContent value="trend" className="mt-4 space-y-3">
              {trending.map((c) => (
                <div key={c.symbol} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={c.icon || "/placeholder.svg"} alt={c.name} className="h-8 w-8 rounded-full bg-white/20" />
                    <span className="font-medium text-gray-100">
                      {c.name} ({c.symbol})
                    </span>
                  </div>
                  <span className={`flex items-center gap-1 ${c.pct >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {c.pct >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {c.pct}&#37;
                  </span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
