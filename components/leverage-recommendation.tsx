"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from "lucide-react"
import { HorizontalProgress } from "@/components/horizontal-progress"
import type { LanguageV2 } from "@/lib/i18n-v2"

interface LeverageRecommendationProps {
  prediction: any
  lang: LanguageV2
}

type RiskLevel = "conservative" | "moderate" | "aggressive"

interface LeverageStrategy {
  name: string
  type: "long" | "short"
  leverage: number
  entryPrice: number
  stopLoss: number
  takeProfit: number
  holdingPeriod: string
  confidence: number
  riskLevel: string
  expectedReturn: number
  reasoning: string
  riskWarning: string
}

export function LeverageRecommendation({ prediction, lang }: LeverageRecommendationProps) {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("moderate")
  const [strategies, setStrategies] = useState<LeverageStrategy[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 多语言文本
  const getText = (key: string) => {
    const texts = {
      title: {
        "zh-CN": "AI杠杆策略推荐",
        "zh-TW": "AI槓桿策略推薦",
        en: "AI Leverage Strategy Recommendations",
        ja: "AIレバレッジ戦略推奨",
        es: "Recomendaciones de Estrategia de Apalancamiento AI",
      },
      riskPreference: {
        "zh-CN": "风险偏好",
        "zh-TW": "風險偏好",
        en: "Risk Preference",
        ja: "リスク選好",
        es: "Preferencia de Riesgo",
      },
      conservative: {
        "zh-CN": "稳健",
        "zh-TW": "穩健",
        en: "Conservative",
        ja: "保守的",
        es: "Conservador",
      },
      moderate: {
        "zh-CN": "平衡",
        "zh-TW": "平衡",
        en: "Moderate",
        ja: "中程度",
        es: "Moderado",
      },
      aggressive: {
        "zh-CN": "激进",
        "zh-TW": "激進",
        en: "Aggressive",
        ja: "積極的",
        es: "Agresivo",
      },
      generateStrategy: {
        "zh-CN": "生成AI杠杆策略",
        "zh-TW": "生成AI槓桿策略",
        en: "Generate AI Leverage Strategy",
        ja: "AIレバレッジ戦略を生成",
        es: "Generar Estrategia de Apalancamiento AI",
      },
      strategyFailed: {
        "zh-CN": "策略生成失败",
        "zh-TW": "策略生成失敗",
        en: "Strategy Generation Failed",
        ja: "戦略生成失敗",
        es: "Fallo en la Generación de Estrategia",
      },
      generating: {
        "zh-CN": "V2 AI策略分析中",
        "zh-TW": "V2 AI策略分析中",
        en: "V2 AI Strategy Analysis",
        ja: "V2 AI戦略分析中",
        es: "Análisis de Estrategia V2 AI",
      },
      analyzingData: {
        "zh-CN": "正在深度分析市场数据和风险参数...",
        "zh-TW": "正在深度分析市場數據和風險參數...",
        en: "Analyzing market data and risk parameters in depth...",
        ja: "市場データとリスクパラメータを詳細分析中...",
        es: "Analizando datos del mercado y parámetros de riesgo en profundidad...",
      },
      recommendedStrategies: {
        "zh-CN": "AI推荐策略",
        "zh-TW": "AI推薦策略",
        en: "AI Recommended Strategies",
        ja: "AI推奨戦略",
        es: "Estrategias Recomendadas por AI",
      },
      tradingDirection: {
        "zh-CN": "交易方向",
        "zh-TW": "交易方向",
        en: "Trading Direction",
        ja: "取引方向",
        es: "Dirección de Trading",
      },
      long: {
        "zh-CN": "做多",
        "zh-TW": "做多",
        en: "Long",
        ja: "ロング",
        es: "Largo",
      },
      short: {
        "zh-CN": "做空",
        "zh-TW": "做空",
        en: "Short",
        ja: "ショート",
        es: "Corto",
      },
      holdingPeriod: {
        "zh-CN": "持仓时间",
        "zh-TW": "持倉時間",
        en: "Holding Period",
        ja: "保有期間",
        es: "Período de Tenencia",
      },
      entryPrice: {
        "zh-CN": "入场价格",
        "zh-TW": "入場價格",
        en: "Entry Price",
        ja: "エントリー価格",
        es: "Precio de Entrada",
      },
      stopLoss: {
        "zh-CN": "止损价格",
        "zh-TW": "止損價格",
        en: "Stop Loss",
        ja: "ストップロス",
        es: "Stop Loss",
      },
      takeProfit: {
        "zh-CN": "止盈价格",
        "zh-TW": "止盈價格",
        en: "Take Profit",
        ja: "テイクプロフィット",
        es: "Take Profit",
      },
      expectedReturn: {
        "zh-CN": "预期收益",
        "zh-TW": "預期收益",
        en: "Expected Return",
        ja: "期待収益",
        es: "Retorno Esperado",
      },
      strategyDescription: {
        "zh-CN": "策略说明",
        "zh-TW": "策略說明",
        en: "Strategy Description",
        ja: "戦略説明",
        es: "Descripción de Estrategia",
      },
      riskWarning: {
        "zh-CN": "风险提示",
        "zh-TW": "風險提示",
        en: "Risk Warning",
        ja: "リスク警告",
        es: "Advertencia de Riesgo",
      },
      lowRisk: {
        "zh-CN": "低风险",
        "zh-TW": "低風險",
        en: "Low Risk",
        ja: "低リスク",
        es: "Bajo Riesgo",
      },
      mediumRisk: {
        "zh-CN": "中风险",
        "zh-TW": "中風險",
        en: "Medium Risk",
        ja: "中リスク",
        es: "Riesgo Medio",
      },
      highRisk: {
        "zh-CN": "高风险",
        "zh-TW": "高風險",
        en: "High Risk",
        ja: "高リスク",
        es: "Alto Riesgo",
      },
      dataIncomplete: {
        "zh-CN": "预测数据不完整，请先进行价格预测",
        "zh-TW": "預測數據不完整，請先進行價格預測",
        en: "Prediction data incomplete, please perform price prediction first",
        ja: "予測データが不完全です。まず価格予測を実行してください",
        es: "Datos de predicción incompletos, realice primero la predicción de precios",
      },
      networkError: {
        "zh-CN": "网络错误，请检查连接后重试",
        "zh-TW": "網路錯誤，請檢查連接後重試",
        en: "Network error, please check connection and retry",
        ja: "ネットワークエラー、接続を確認して再試行してください",
        es: "Error de red, verifique la conexión y reintente",
      },
    }

    return texts[key]?.[lang] || texts[key]?.["zh-CN"] || key
  }

  const riskLevels = {
    conservative: { label: getText("conservative"), color: "bg-green-500", leverage: [2, 5] },
    moderate: { label: getText("moderate"), color: "bg-yellow-500", leverage: [5, 10] },
    aggressive: { label: getText("aggressive"), color: "bg-red-500", leverage: [10, 20] },
  }

  const formatPrice = (price: number) => {
    if (isNaN(price) || price <= 0) return "0.00"

    if (price < 0.001) {
      return price.toFixed(8)
    } else if (price < 0.01) {
      return price.toFixed(6)
    } else if (price < 0.1) {
      return price.toFixed(5)
    } else if (price < 1) {
      return price.toFixed(4)
    } else if (price < 100) {
      return price.toFixed(2)
    } else {
      return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    }
  }

  const generateStrategies = async () => {
    if (!prediction || !prediction.predictions) {
      setError(getText("dataIncomplete"))
      return
    }

    setIsGenerating(true)
    setStrategies([])
    setError(null)
  }

  const performAPICall = async () => {
    try {
      console.log("Calling V2 AI API for leverage strategies...")

      const response = await fetch("/api/leverage-strategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prediction,
          riskLevel,
          lang,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Received strategies from V2 AI:", data)

        if (data.strategies && Array.isArray(data.strategies)) {
          setStrategies(data.strategies)
        } else {
          throw new Error("Invalid strategy data format")
        }
      } else {
        const errorText = await response.text()
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("Error calling V2 AI API:", error)
      setError(getText("networkError"))
    } finally {
      setIsGenerating(false)
    }
  }

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "conservative":
        return "text-green-400"
      case "moderate":
        return "text-yellow-400"
      case "aggressive":
        return "text-red-400"
    }
  }

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "conservative":
        return <Target className="h-4 w-4" />
      case "moderate":
        return <AlertTriangle className="h-4 w-4" />
      case "aggressive":
        return <Zap className="h-4 w-4" />
    }
  }

  const getStrategyRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-400 bg-green-400/20"
      case "medium":
        return "text-yellow-400 bg-yellow-400/20"
      case "high":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return getText("lowRisk")
      case "medium":
        return getText("mediumRisk")
      case "high":
        return getText("highRisk")
      default:
        return riskLevel
    }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <TrendingUp className="h-5 w-5 text-orange-400" />
          {getText("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 风险等级选择 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">{getText("riskPreference")}</span>
            <Badge variant="secondary" className={`${getRiskColor(riskLevel)} bg-white/10 border border-white/20`}>
              {getRiskIcon(riskLevel)}
              <span className="ml-1">{riskLevels[riskLevel].label}</span>
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(riskLevels) as RiskLevel[]).map((level) => (
              <Button
                key={level}
                variant={riskLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setRiskLevel(level)}
                className={`${
                  riskLevel === level
                    ? "bg-white text-black"
                    : "bg-white/10 border-white/20 text-gray-700 hover:bg-white/20"
                }`}
              >
                {getRiskIcon(level)}
                <span className="ml-1">{riskLevels[level].label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* 生成策略按钮 */}
        <Button
          onClick={generateStrategies}
          disabled={!prediction || isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
        >
          {getText("generateStrategy")}
        </Button>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">{getText("strategyFailed")}</span>
            </div>
            <p className="text-gray-300 text-sm mt-2">{error}</p>
          </div>
        )}

        {/* 横向进度条 */}
        {isGenerating && (
          <HorizontalProgress
            isActive={isGenerating}
            onComplete={performAPICall}
            duration={8000}
            title={getText("generating")}
            subtitle={getText("analyzingData")}
          />
        )}

        {/* 策略推荐 */}
        {strategies.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-gray-900 font-semibold">{getText("recommendedStrategies")}</h4>

            {strategies.map((strategy, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {strategy.type === "long" ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`font-semibold ${strategy.type === "long" ? "text-green-400" : "text-red-400"}`}>
                      {strategy.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStrategyRiskColor(strategy.riskLevel)}>
                      {getRiskLevelText(strategy.riskLevel)}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-gray-900 border border-white/30">
                      {strategy.leverage}x
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">{getText("tradingDirection")}:</span>
                    <span
                      className={`ml-2 font-semibold ${strategy.type === "long" ? "text-green-400" : "text-red-400"}`}
                    >
                      {strategy.type === "long" ? getText("long") : getText("short")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300">{getText("holdingPeriod")}:</span>
                    <span className="text-gray-900 ml-2">{strategy.holdingPeriod}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">{getText("entryPrice")}:</span>
                    <span className="text-gray-900 ml-2">${formatPrice(strategy.entryPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">{getText("stopLoss")}:</span>
                    <span className="text-red-400 ml-2">${formatPrice(strategy.stopLoss)}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">{getText("takeProfit")}:</span>
                    <span className="text-green-400 ml-2">${formatPrice(strategy.takeProfit)}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">{getText("expectedReturn")}:</span>
                    {(() => {
                      const num = Number(strategy.expectedReturn)
                      const isValid = Number.isFinite(num)
                      const sign = isValid && num >= 0 ? "+" : ""
                      const color = !isValid ? "text-gray-400" : num >= 0 ? "text-green-400" : "text-red-400"

                      return (
                        <span className={`ml-2 font-semibold ${color}`}>
                          {isValid ? `${sign}${num.toFixed(1)}%` : "N/A"}
                        </span>
                      )
                    })()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-300 bg-white/5 p-3 rounded">
                    <strong>{getText("strategyDescription")}:</strong>
                    <p className="mt-1 text-gray-800">{strategy.reasoning}</p>
                  </div>

                  <div className="text-xs text-yellow-400 bg-yellow-400/10 p-3 rounded border border-yellow-400/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{getText("riskWarning")}:</strong>
                        <p className="mt-1">{strategy.riskWarning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
