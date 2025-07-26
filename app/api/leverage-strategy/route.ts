import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { translationsV2, type LanguageV2 } from "@/lib/i18n-v2" // Import translationsV2

// 创建 DeepSeek 客户端
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "your-deepseek-api-key",
  baseURL: "https://api.deepseek.com",
})

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { prediction, riskLevel, lang } = await req.json()

    if (!prediction || !riskLevel) {
      return new Response("Missing required parameters", { status: 400 })
    }

    console.log("[Leverage Strategy API] Starting strategy generation...")

    // 首先尝试使用DeepSeek API
    try {
      console.log("[Leverage Strategy API] Calling DeepSeek API...")

      const prompt = `作为一名专业的加密货币杠杆交易策略师，请为${prediction.symbol}制定杠杆交易策略。

当前数据：
- 币种：${prediction.symbol}
- 当前价格：$${prediction.currentPrice}
- 1小时预测：$${prediction.predictions["1h"].price} (${prediction.predictions["1h"].trend}, 置信度: ${(prediction.predictions["1h"].confidence * 100).toFixed(1)}%)
- 24小时预测：$${prediction.predictions["24h"].price} (${prediction.predictions["24h"].trend}, 置信度: ${(prediction.predictions["24h"].confidence * 100).toFixed(1)}%)
- 7天预测：$${prediction.predictions["7d"].price} (${prediction.predictions["7d"].trend}, 置信度: ${(prediction.predictions["7d"].confidence * 100).toFixed(1)}%)
- 风险偏好：${riskLevel}

请根据风险偏好制定2-3个杠杆交易策略，必须以JSON格式返回：

{
  "strategies": [
    {
      "name": "策略名称",
      "type": "long" 或 "short",
      "leverage": 杠杆倍数(数字),
      "entryPrice": 入场价格(数字),
      "stopLoss": 止损价格(数字),
      "takeProfit": 止盈价格(数字),
      "holdingPeriod": "持仓时间",
      "confidence": 置信度(0-1之间的数字),
      "riskLevel": "low/medium/high",
      "expectedReturn": 预期收益率百分比(数字),
      "reasoning": "策略说明",
      "riskWarning": "风险提示"
    }
  ]
}

风险偏好说明：
- conservative: 低风险，杠杆2-5倍
- moderate: 中等风险，杠杆5-10倍  
- aggressive: 高风险，杠杆10-20倍

请确保：
1. 策略合理且可执行
2. 收益计算准确
3. 风险控制到位
4. 每个策略都有详细说明
5. 语言使用${lang === "zh-CN" ? "中文" : lang === "zh-TW" ? "繁体中文" : lang === "es" ? "Spanish" : lang === "ja" ? "Japanese" : "English"}
`

      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        prompt,
        temperature: 0.6,
        maxTokens: 3000,
      })

      console.log("[Leverage Strategy API] DeepSeek response received:", text.substring(0, 200) + "...")

      // 尝试解析JSON
      const jsonStr = extractJson(text)
      if (jsonStr) {
        try {
          const strategies = JSON.parse(jsonStr)
          console.log("[Leverage Strategy API] Successfully parsed DeepSeek response")
          return Response.json(strategies)
        } catch (parseError) {
          console.error("[Leverage Strategy API] JSON parse error:", parseError)
          throw new Error("Failed to parse DeepSeek response")
        }
      } else {
        console.error("[Leverage Strategy API] No valid JSON found in DeepSeek response")
        throw new Error("No valid JSON in DeepSeek response")
      }
    } catch (deepseekError) {
      console.error("[Leverage Strategy API] DeepSeek API failed:", deepseekError)

      // DeepSeek失败时使用备用策略
      console.log("[Leverage Strategy API] Falling back to local strategies")
      const strategies = generateFallbackStrategies(prediction, riskLevel, lang) // Pass lang to fallback
      return Response.json(strategies)
    }
  } catch (error) {
    console.error("Leverage strategy generation error:", error)

    // 最后的备用方案
    try {
      const { prediction, riskLevel, lang } = await req.json() // Ensure lang is available here too
      const fallback = generateFallbackStrategies(prediction, riskLevel, lang)
      return Response.json(fallback)
    } catch {
      return new Response("Strategy generation failed", { status: 500 })
    }
  }
}

function extractJson(raw: string): string | null {
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) return null
  return raw.slice(start, end + 1)
}

function generateFallbackStrategies(prediction: any, riskLevel: string, lang: LanguageV2) {
  const currentPrice = prediction.currentPrice || 50000
  const symbol = prediction.symbol || "BTC"
  const pred1h = prediction.predictions?.["1h"] || { price: currentPrice * 1.02, trend: "up", confidence: 0.6 }
  const pred24h = prediction.predictions?.["24h"] || { price: currentPrice * 1.05, trend: "up", confidence: 0.5 }

  console.log("[Leverage Strategy API] Generating fallback strategies for", symbol)

  const leverageMap = {
    conservative: [2, 3, 5],
    moderate: [5, 7, 10],
    aggressive: [10, 15, 20],
  }

  const leverages = leverageMap[riskLevel as keyof typeof leverageMap] || [5, 7, 10]

  // Get localized texts for fallback strategies
  const t = translationsV2[lang]?.fallbackStrategies || translationsV2["zh-CN"].fallbackStrategies

  // 修正收益计算公式
  const calculateReturn = (entryPrice: number, targetPrice: number, leverage: number, isLong: boolean) => {
    if (!entryPrice || !targetPrice || entryPrice <= 0 || targetPrice <= 0) {
      return 0
    }

    const priceChangePercent = (targetPrice - entryPrice) / entryPrice
    const direction = isLong ? 1 : -1
    const leveragedReturn = priceChangePercent * direction * leverage * 100

    // 限制收益率在合理范围内
    return Math.max(-95, Math.min(500, leveragedReturn))
  }

  // 生成更智能的策略
  const strategies = []

  // 策略1：短期趋势策略
  const strategy1IsLong = pred1h.trend === "up"
  const strategy1Leverage = leverages[0]
  const strategy1StopLoss = strategy1IsLong ? currentPrice * 0.97 : currentPrice * 1.03
  const strategy1TakeProfit = pred1h.price
  const strategy1Return = calculateReturn(currentPrice, strategy1TakeProfit, strategy1Leverage, strategy1IsLong)

  strategies.push({
    name: "短期趋势策略",
    type: strategy1IsLong ? "long" : "short",
    leverage: strategy1Leverage,
    entryPrice: currentPrice,
    stopLoss: strategy1StopLoss,
    takeProfit: strategy1TakeProfit,
    holdingPeriod: "1-4小时",
    confidence: pred1h.confidence,
    riskLevel: riskLevel === "conservative" ? "low" : riskLevel === "moderate" ? "medium" : "high",
    expectedReturn: strategy1Return,
    reasoning: (strategy1IsLong ? t.shortTermReasoningUp : t.shortTermReasoningDown)
      .replace("{symbol}", symbol)
      .replace("{leverage}", strategy1Leverage.toString())
      .replace("${takeProfit}", `$${strategy1TakeProfit.toFixed(2)}`),
    riskWarning: t.shortTermRiskWarning,
  })

  // 策略2：中期波段策略
  const strategy2IsLong = pred24h.trend === "up"
  const strategy2Leverage = leverages[1]
  const strategy2StopLoss = strategy2IsLong ? currentPrice * 0.94 : currentPrice * 1.06
  const strategy2TakeProfit = pred24h.price
  const strategy2Return = calculateReturn(currentPrice, strategy2TakeProfit, strategy2Leverage, strategy2IsLong)

  strategies.push({
    name: "中期波段策略",
    type: strategy2IsLong ? "long" : "short",
    leverage: strategy2Leverage,
    entryPrice: currentPrice,
    stopLoss: strategy2StopLoss,
    takeProfit: strategy2TakeProfit,
    holdingPeriod: "6-24小时",
    confidence: pred24h.confidence,
    riskLevel: "medium",
    expectedReturn: strategy2Return,
    reasoning: (strategy2IsLong ? t.mediumTermReasoningUp : t.mediumTermReasoningDown)
      .replace("{symbol}", symbol)
      .replace("{leverage}", strategy2Leverage.toString()),
    riskWarning: t.mediumTermRiskWarning,
  })

  // 策略3：保守套利策略（仅在conservative模式下）
  if (riskLevel === "conservative") {
    const strategy3Leverage = 2
    const strategy3IsLong = Math.random() > 0.5
    const strategy3StopLoss = strategy3IsLong ? currentPrice * 0.98 : currentPrice * 1.02
    const strategy3TakeProfit = strategy3IsLong ? currentPrice * 1.03 : currentPrice * 0.97
    const strategy3Return = calculateReturn(currentPrice, strategy3TakeProfit, strategy3Leverage, strategy3IsLong)

    strategies.push({
      name: "保守套利策略",
      type: strategy3IsLong ? "long" : "short",
      leverage: strategy3Leverage,
      entryPrice: currentPrice,
      stopLoss: strategy3StopLoss,
      takeProfit: strategy3TakeProfit,
      holdingPeriod: "2-6小时",
      confidence: 0.7,
      riskLevel: "low",
      expectedReturn: strategy3Return,
      reasoning: t.conservativeArbitrageReasoning,
      riskWarning: t.conservativeArbitrageRiskWarning,
    })
  }

  // 策略3：激进突破策略（仅在aggressive模式下）
  if (riskLevel === "aggressive") {
    const strategy3Leverage = leverages[2]
    const strategy3IsLong = pred24h.confidence > 0.6 ? pred24h.trend === "up" : Math.random() > 0.5
    const strategy3StopLoss = strategy3IsLong ? currentPrice * 0.92 : currentPrice * 1.08
    const strategy3TakeProfit = strategy3IsLong ? currentPrice * 1.15 : currentPrice * 0.85
    const strategy3Return = calculateReturn(currentPrice, strategy3TakeProfit, strategy3Leverage, strategy3IsLong)

    strategies.push({
      name: "激进突破策略",
      type: strategy3IsLong ? "long" : "short",
      leverage: strategy3Leverage,
      entryPrice: currentPrice,
      stopLoss: strategy3StopLoss,
      takeProfit: strategy3TakeProfit,
      holdingPeriod: "12-48小时",
      confidence: Math.max(pred24h.confidence - 0.1, 0.3),
      riskLevel: "high",
      expectedReturn: strategy3Return,
      reasoning: (strategy3IsLong ? t.aggressiveBreakoutReasoningUp : t.aggressiveBreakoutReasoningDown)
        .replace("{symbol}", symbol)
        .replace("{leverage}", strategy3Leverage.toString()),
      riskWarning: t.aggressiveBreakoutRiskWarning,
    })
  }

  return { strategies }
}
