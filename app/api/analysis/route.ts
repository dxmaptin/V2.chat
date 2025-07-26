import { type NextRequest, NextResponse } from "next/server"

interface PredictionData {
  symbol: string
  currentPrice: number
  predictions: {
    "1h": { price: number; confidence: number; trend: "up" | "down" | "stable" }
    "24h": { price: number; confidence: number; trend: "up" | "down" | "stable" }
    "7d": { price: number; confidence: number; trend: "up" | "down" | "stable" }
  }
  analysis: {
    technical: string
    sentiment: string
    risk: string
    support: number
    resistance: number
  }
}

interface DetailedAnalysis {
  technicalAnalysis: {
    indicators: string
    supportResistance: string
    volume: string
    patterns: string
  }
  fundamentalAnalysis: {
    projectFundamentals: string
    marketPosition: string
    recentNews: string
    ecosystem: string
  }
  sentimentAnalysis: {
    marketSentiment: string
    socialMedia: string
    institutionalFlow: string
    fearGreed: string
  }
  macroAnalysis: {
    marketTrend: string
    regulation: string
    macroEconomic: string
    fedPolicy: string
  }
  riskAssessment: {
    riskFactors: string
    riskLevel: string
    mitigation: string
  }
  investmentAdvice: {
    shortTerm: string
    mediumTerm: string
    longTerm: string
    positionManagement: string
  }
}

function generateFallbackAnalysis(symbol: string, lang: string): DetailedAnalysis {
  const fallbackTexts = {
    "zh-CN": {
      technicalAnalysis: {
        indicators: "RSI显示超买状态，MACD呈现看跌信号，布林带收窄表明波动性降低",
        supportResistance: "关键支撑位在当前价格下方5-8%，阻力位在上方10-15%区间",
        volume: "成交量相对平均水平偏低，缺乏明显的突破信号",
        patterns: "价格形态呈现三角整理，等待方向性突破",
      },
      fundamentalAnalysis: {
        projectFundamentals: "项目技术基础扎实，开发团队活跃，社区参与度较高",
        marketPosition: "在同类项目中处于中上游位置，市值排名相对稳定",
        recentNews: "近期无重大利好或利空消息，市场情绪相对平稳",
        ecosystem: "生态系统发展稳步推进，合作伙伴关系良好",
      },
      sentimentAnalysis: {
        marketSentiment: "整体市场情绪谨慎乐观，投资者观望情绪较浓",
        socialMedia: "社交媒体讨论热度中等，正面评价占主导",
        institutionalFlow: "机构资金流向相对平衡，无明显大额进出",
        fearGreed: "恐慌贪婪指数处于中性区间，市场情绪相对理性",
      },
      macroAnalysis: {
        marketTrend: "大盘趋势震荡整理，缺乏明确方向性指引",
        regulation: "监管环境相对稳定，无重大政策变化预期",
        macroEconomic: "宏观经济数据喜忧参半，对加密市场影响有限",
        fedPolicy: "美联储政策预期相对明确，市场已充分消化",
      },
      riskAssessment: {
        riskFactors: "主要风险包括市场波动、监管变化、技术风险等",
        riskLevel: "当前风险等级为中等，建议谨慎操作",
        mitigation: "建议分散投资，设置止损，关注市场动态",
      },
      investmentAdvice: {
        shortTerm: "短期内建议观望为主，等待明确信号后再行动",
        mediumTerm: "中期可考虑分批建仓，控制仓位规模",
        longTerm: "长期看好项目发展前景，可适当配置",
        positionManagement: "建议仓位控制在总资产的5-10%以内",
      },
    },
    en: {
      technicalAnalysis: {
        indicators:
          "RSI shows overbought conditions, MACD presents bearish signals, Bollinger Bands narrowing indicates reduced volatility",
        supportResistance: "Key support level 5-8% below current price, resistance in 10-15% range above",
        volume: "Trading volume below average, lacking clear breakout signals",
        patterns: "Price pattern shows triangular consolidation, awaiting directional breakout",
      },
      fundamentalAnalysis: {
        projectFundamentals: "Solid technical foundation, active development team, high community engagement",
        marketPosition: "Upper-middle position among similar projects, relatively stable market cap ranking",
        recentNews: "No major positive or negative news recently, market sentiment relatively stable",
        ecosystem: "Ecosystem development progressing steadily, good partnership relationships",
      },
      sentimentAnalysis: {
        marketSentiment: "Overall market sentiment cautiously optimistic, investors in wait-and-see mode",
        socialMedia: "Moderate social media discussion heat, positive reviews dominating",
        institutionalFlow: "Institutional fund flows relatively balanced, no significant large inflows/outflows",
        fearGreed: "Fear & Greed index in neutral range, market sentiment relatively rational",
      },
      macroAnalysis: {
        marketTrend: "Overall market trend in consolidation, lacking clear directional guidance",
        regulation: "Regulatory environment relatively stable, no major policy changes expected",
        macroEconomic: "Mixed macroeconomic data, limited impact on crypto markets",
        fedPolicy: "Fed policy expectations relatively clear, market has fully digested",
      },
      riskAssessment: {
        riskFactors: "Main risks include market volatility, regulatory changes, technical risks",
        riskLevel: "Current risk level is moderate, recommend cautious operation",
        mitigation: "Recommend diversified investment, set stop-losses, monitor market dynamics",
      },
      investmentAdvice: {
        shortTerm: "Short-term recommend wait-and-see, act after clear signals",
        mediumTerm: "Medium-term consider gradual position building, control position size",
        longTerm: "Long-term optimistic about project prospects, appropriate allocation recommended",
        positionManagement: "Recommend position control within 5-10% of total assets",
      },
    },
  }

  const texts = fallbackTexts[lang as keyof typeof fallbackTexts] || fallbackTexts["zh-CN"]
  return texts
}

export async function POST(req: NextRequest) {
  try {
    const { prediction, lang } = await req.json()

    if (!prediction) {
      return NextResponse.json({ error: "Missing prediction data" }, { status: 400 })
    }

    console.log(`[Analysis API] Starting analysis for ${prediction.symbol} in ${lang}`)

    // 构建详细的分析提示词
    const prompt = `
作为专业的加密货币分析师，请基于以下预测数据为${prediction.symbol}提供详细的分析报告。

预测数据：
- 当前价格: $${prediction.currentPrice}
- 1小时预测: $${prediction.predictions["1h"].price} (置信度: ${(prediction.predictions["1h"].confidence * 100).toFixed(1)}%, 趋势: ${prediction.predictions["1h"].trend})
- 24小时预测: $${prediction.predictions["24h"].price} (置信度: ${(prediction.predictions["24h"].confidence * 100).toFixed(1)}%, 趋势: ${prediction.predictions["24h"].trend})
- 7天预测: $${prediction.predictions["7d"].price} (置信度: ${(prediction.predictions["7d"].confidence * 100).toFixed(1)}%, 趋势: ${prediction.predictions["7d"].trend})

基础分析：
- 技术分析: ${prediction.analysis.technical}
- 市场情绪: ${prediction.analysis.sentiment}
- 风险评估: ${prediction.analysis.risk}
- 支撑位: $${prediction.analysis.support}
- 阻力位: $${prediction.analysis.resistance}

请提供以下六个维度的详细分析，每个维度包含指定的子项目。请确保返回严格的JSON格式：

{
  "technicalAnalysis": {
    "indicators": "技术指标分析（RSI、MACD、布林带、KDJ等）",
    "supportResistance": "支撑阻力位分析",
    "volume": "成交量分析",
    "patterns": "图表形态分析"
  },
  "fundamentalAnalysis": {
    "projectFundamentals": "项目基本面分析",
    "marketPosition": "市场地位分析",
    "recentNews": "近期消息影响",
    "ecosystem": "生态发展状况"
  },
  "sentimentAnalysis": {
    "marketSentiment": "市场情绪分析",
    "socialMedia": "社交媒体情绪",
    "institutionalFlow": "机构资金流向",
    "fearGreed": "恐慌贪婪指数"
  },
  "macroAnalysis": {
    "marketTrend": "大盘趋势分析",
    "regulation": "监管政策影响",
    "macroEconomic": "宏观经济影响",
    "fedPolicy": "美联储政策影响"
  },
  "riskAssessment": {
    "riskFactors": "主要风险因素",
    "riskLevel": "风险等级评估",
    "mitigation": "风险缓解建议"
  },
  "investmentAdvice": {
    "shortTerm": "短期投资建议（1-7天）",
    "mediumTerm": "中期投资建议（1-4周）",
    "longTerm": "长期投资建议（1-6个月）",
    "positionManagement": "仓位管理建议"
  }
}

请确保：
1. 返回纯JSON格式，不要包含任何其他文本
2. 每个字段都是字符串类型
3. 分析内容专业、具体、有价值
4. 语言使用${lang === "zh-CN" ? "中文" : lang === "zh-TW" ? "繁体中文" : "English"}
`

    try {
      // 调用 DeepSeek API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new Error("No content in DeepSeek response")
      }

      // 尝试解析 JSON
      let analysisResult
      try {
        // 清理可能的 markdown 代码块标记
        const cleanContent = content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim()
        analysisResult = JSON.parse(cleanContent)
      } catch (parseError) {
        console.error("[Analysis API] JSON parse error:", parseError)
        throw new Error("Failed to parse DeepSeek response")
      }

      // 验证返回的数据结构
      const requiredFields = [
        "technicalAnalysis",
        "fundamentalAnalysis",
        "sentimentAnalysis",
        "macroAnalysis",
        "riskAssessment",
        "investmentAdvice",
      ]

      for (const field of requiredFields) {
        if (!analysisResult[field] || typeof analysisResult[field] !== "object") {
          throw new Error(`Missing or invalid field: ${field}`)
        }
      }

      console.log(`[Analysis API] Successfully generated analysis for ${prediction.symbol}`)
      return NextResponse.json(analysisResult)
    } catch (deepseekError) {
      console.error("[Analysis API] DeepSeek API failed:", deepseekError)

      // 返回备用分析
      const fallbackAnalysis = generateFallbackAnalysis(prediction.symbol, lang)
      console.log(`[Analysis API] Using fallback analysis for ${prediction.symbol}`)
      return NextResponse.json(fallbackAnalysis)
    }
  } catch (error) {
    console.error("[Analysis API] General error:", error)

    // 即使在一般错误情况下也返回备用分析
    const fallbackAnalysis = generateFallbackAnalysis("UNKNOWN", "zh-CN")
    return NextResponse.json(fallbackAnalysis)
  }
}
