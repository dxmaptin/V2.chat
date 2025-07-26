"use client"

import type React from "react"
import { Target } from "lucide-react"

import { useState, useEffect, useCallback } from "react"
import {
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  Shield,
  Globe,
  Send,
  BarChart3,
  MessageSquare,
  Clock,
  Calendar,
  CalendarDays,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  XCircle,
  Search,
  Wifi,
  Brain,
  Activity,
  Layers,
  Cpu,
} from "lucide-react"
import { useChat } from "ai/react"
import { translationsV2, type LanguageV2 } from "@/lib/i18n-v2"
import { WifiIndicator } from "@/components/wifi-indicator"
import { LanguageSelector } from "@/components/language-selector"
import { CircularProgress } from "@/components/circular-progress"
import { LeverageRecommendation } from "@/components/leverage-recommendation"
import { DisclaimerModal } from "@/components/disclaimer-modal"
import { Footer } from "@/components/footer"
import { RiskDisclosureBanner } from "@/components/risk-disclosure-banner"
import { WelcomeModal } from "@/components/welcome-modal"

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

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: string
  marketCap: string
}

interface MarketStats {
  totalPredictions: number
  activeUsers: number
  predictionAccuracy: number
}

export function CryptoProductSite() {
  const [lang, setLang] = useState<LanguageV2>("zh-CN")
  const [symbol, setSymbol] = useState("")
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedAnalysis | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "loading">("loading")
  const [predictionError, setPredictionError] = useState<string | null>(null)
  const [analysisRequested, setAnalysisRequested] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [chatMode, setChatMode] = useState<"normal" | "deepsearch">("normal")
  const [activePredictionTimeframe, setActivePredictionTimeframe] = useState<"1h" | "24h" | "7d">("1h")

  // 真实市场统计数据
  const [marketStats, setMarketStats] = useState<MarketStats>({
    totalPredictions: 9000,
    activeUsers: 80,
    predictionAccuracy: 65.0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // CountUpNumber组件 - 平滑数字动画
  const CountUpNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(value)
    const [prevValue, setPrevValue] = useState(value)

    useEffect(() => {
      if (value !== prevValue) {
        const increment = value > prevValue ? 1 : -1
        const step = Math.abs(value - prevValue) / 30 // 30步完成动画
        let current = prevValue

        const timer = setInterval(() => {
          current += increment * step
          if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
            setDisplayValue(value)
            clearInterval(timer)
          } else {
            setDisplayValue(Math.floor(current))
          }
        }, 50) // 每50ms更新一次

        setPrevValue(value)
        return () => clearInterval(timer)
      }
    }, [value, prevValue])

    return <span>{displayValue.toLocaleString()}</span>
  }

  // 获取真实市场统计数据
  const fetchMarketStats = async () => {
    if (isLoadingStats) return

    setIsLoadingStats(true)
    try {
      console.log("Fetching real market stats...")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 12000)

      const response = await fetch("/api/market-stats", {
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const stats = await response.json()
        console.log("Received real market stats:", stats)
        setMarketStats(stats)
      } else {
        throw new Error(`Stats API error: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to fetch market stats:", error)
      // 保持当前数据，不更新
    } finally {
      setIsLoadingStats(false)
    }
  }

  // 页面加载时获取真实统计数据
  useEffect(() => {
    fetchMarketStats()
    // 每45秒更新一次真实数据 (避免API限制)
    const interval = setInterval(fetchMarketStats, 45000)
    return () => clearInterval(interval)
  }, [])

  // 获取详细分析标签的翻译
  const getAnalysisLabel = (key: string) => {
    const labels = {
      technicalIndicators: {
        "zh-CN": "技术指标",
        "zh-TW": "技術指標",
        en: "Technical Indicators",
        ja: "テクニカル指標",
        es: "Indicadores Técnicos",
      },
      supportResistance: {
        "zh-CN": "支撑阻力",
        "zh-TW": "支撐阻力",
        en: "Support/Resistance",
        ja: "サポート/レジスタンス",
        es: "Soporte/Resistencia",
      },
      volume: {
        "zh-CN": "成交量",
        "zh-TW": "成交量",
        en: "Volume",
        ja: "出来高",
        es: "Volumen",
      },
      patterns: {
        "zh-CN": "图表形态",
        "zh-TW": "圖表形態",
        en: "Chart Patterns",
        ja: "チャートパターン",
        es: "Patrones de Gráfico",
      },
      projectFundamentals: {
        "zh-CN": "项目基本面",
        "zh-TW": "項目基本面",
        en: "Project Fundamentals",
        ja: "プロジェクトファンダメンタルズ",
        es: "Fundamentos del Proyecto",
      },
      marketPosition: {
        "zh-CN": "市场地位",
        "zh-TW": "市場地位",
        en: "Market Position",
        ja: "市場地位",
        es: "Posición de Mercado",
      },
      recentNews: {
        "zh-CN": "近期消息",
        "zh-TW": "近期消息",
        en: "Recent News",
        ja: "最近のニュース",
        es: "Noticias Recientes",
      },
      ecosystem: {
        "zh-CN": "生态发展",
        "zh-TW": "生態發展",
        en: "Ecosystem Development",
        ja: "エコシステム開発",
        es: "Desarrollo del Ecosistema",
      },
      marketSentiment: {
        "zh-CN": "市场情绪",
        "zh-TW": "市場情緒",
        en: "Market Sentiment",
        ja: "市場センチメント",
        es: "Sentimiento del Mercado",
      },
      socialMedia: {
        "zh-CN": "社交媒体",
        "zh-TW": "社交媒體",
        en: "Social Media",
        ja: "ソーシャルメディア",
        es: "Redes Sociales",
      },
      institutionalFlow: {
        "zh-CN": "机构资金",
        "zh-TW": "機構資金",
        en: "Institutional Flow",
        ja: "機関投資家の資金",
        es: "Flujo Institucional",
      },
      fearGreed: {
        "zh-CN": "恐慌贪婪",
        "zh-TW": "恐慌貪婪",
        en: "Fear & Greed",
        ja: "恐怖と貪欲",
        es: "Miedo y Codicia",
      },
      shortTerm: {
        "zh-CN": "短期建议",
        "zh-TW": "短期建議",
        en: "Short-term Advice",
        ja: "短期アドバイス",
        es: "Consejo a Corto Plazo",
      },
      mediumTerm: {
        "zh-CN": "中期建议",
        "zh-TW": "中期建議",
        en: "Medium-term Advice",
        ja: "中期アドバイス",
        es: "Consejo a Medio Plazo",
      },
      longTerm: {
        "zh-CN": "长期建议",
        "zh-TW": "長期建議",
        en: "Long-term Advice",
        ja: "長期アドバイス",
        es: "Consejo a Largo Plazo",
      },
      positionManagement: {
        "zh-CN": "仓位管理",
        "zh-TW": "倉位管理",
        en: "Position Management",
        ja: "ポジション管理",
        es: "Gestión de Posiciones",
      },
      riskFactors: {
        "zh-CN": "风险因素",
        "zh-TW": "風險因素",
        en: "Risk Factors",
        ja: "リスク要因",
        es: "Factores de Riesgo",
      },
      riskLevel: {
        "zh-CN": "风险等级",
        "zh-TW": "風險等級",
        en: "Risk Level",
        ja: "リスクレベル",
        es: "Nivel de Riesgo",
      },
      mitigation: {
        "zh-CN": "风险缓解",
        "zh-TW": "風險緩解",
        en: "Risk Mitigation",
        ja: "リスク軽減",
        es: "Mitigación de Riesgos",
      },
      marketTrend: {
        "zh-CN": "市场趋势",
        "zh-TW": "市場趨勢",
        en: "Market Trend",
        ja: "市場トレンド",
        es: "Tendencia del Mercado",
      },
      regulation: {
        "zh-CN": "监管政策",
        "zh-TW": "監管政策",
        en: "Regulatory Policy",
        ja: "規制政策",
        es: "Política Regulatoria",
      },
      macroEconomic: {
        "zh-CN": "宏观经济",
        "zh-TW": "宏觀經濟",
        en: "Macro Economy",
        ja: "マクロ経済",
        es: "Macroeconomía",
      },
      fedPolicy: {
        "zh-CN": "美联储政策",
        "zh-TW": "美聯儲政策",
        en: "Fed Policy",
        ja: "FED政策",
        es: "Política de la Fed",
      },
    }

    return labels[key]?.[lang] || labels[key]?.["zh-CN"] || key
  }

  const t = translationsV2[lang]

  // 使用 useChat 来处理聊天功能
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: {
      mode: chatMode,
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: getInitialMessage(lang, chatMode),
      },
    ],
  })

  // 根据语言和模式获取初始消息
  function getInitialMessage(language: LanguageV2, mode: "normal" | "deepsearch"): string {
    if (mode === "deepsearch") {
      const deepSearchMessages = {
        "zh-CN":
          "🧠 V2 Deep Search 已激活！我现在使用DeepSeek Reasoner模型，具备强大的逻辑推理能力。我可以进行深度分析、多步骤推理，并结合最新搜索信息为您提供专业洞察。让我先获取最新的市场数据给你看看！",
        "zh-TW":
          "🧠 V2 Deep Search 已激活！我現在使用DeepSeek Reasoner模型，具備強大的邏輯推理能力。我可以進行深度分析、多步驟推理，並結合最新搜索信息為您提供專業洞察。讓我先獲取最新的市場數據給你看看！",
        en: "🧠 V2 Deep Search activated! I'm now using the DeepSeek Reasoner model with powerful logical reasoning capabilities. I can perform deep analysis, multi-step reasoning, and provide professional insights combined with latest search information. Let me get the latest market data for you first!",
        ja: "🧠 V2 Deep Search が起動しました！強力な論理推理能力を持つDeepSeek Reasonerモデルを使用しています。深度分析、多段階推理を行い、最新の検索情報と組み合わせて専門的な洞察を提供できます。まず最新の市場データを取得してお見せします！",
        es: "🧠 ¡V2 Deep Search activado! Ahora uso el modelo DeepSeek Reasoner con poderosas capacidades de razonamiento lógico. Puedo realizar análisis profundos, razonamiento de múltiples pasos y proporcionar insights profesionales combinados con información de búsqueda actualizada. ¡Déjame obtener los datos de mercado más recientes para ti primero!",
      }
      return deepSearchMessages[language] || deepSearchMessages["zh-CN"]
    }

    const normalMessages = {
      "zh-CN":
        "嘿！我是V2，你的专属加密货币顾问兼段子手。现在我已经联网了！🌐 我可以随时为你获取最新的价格数据和市场动态。想看看现在的市场情况吗？😎",
      "zh-TW":
        "嘿！我是V2，你的專屬加密貨幣顧問兼段子手。現在我已經聯網了！🌐 我可以隨時為你獲取最新的價格數據和市場動態。想看看現在的市場情況嗎？😎",
      en: "Hey! I'm V2, your personal crypto advisor and comedian. I'm now connected to the internet! 🌐 I can get the latest price data and market updates for you anytime. Want to see the current market situation? 😎",
      ja: "やあ！僕はV2、君専用の暗号通貨アドバイザー兼コメディアンだ。今はインターネットに接続されている！🌐 いつでも最新の価格データと市場情報を取得できるよ。現在の市場状況を見てみる？😎",
      es: "¡Hola! Soy V2, tu asesor personal de criptomonedas y comediante. ¡Ahora estoy conectado a internet! 🌐 Puedo obtener los datos de precios más recientes y actualizaciones del mercado para ti en cualquier momento. ¿Quieres ver la situación actual del mercado? 😎",
    }
    return normalMessages[language] || normalMessages["zh-CN"]
  }

  // 当模式切换时重置聊天
  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: getInitialMessage(lang, chatMode),
      },
    ])
  }, [chatMode, lang, setMessages])

  // 修复详细分析函数，避免无限循环
  const fetchDetailedAnalysis = async (predictionData: PredictionData) => {
    if (isAnalyzing || analysisRequested) return

    setIsAnalyzing(true)
    setAnalysisRequested(true)

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prediction: predictionData,
          lang,
        }),
      })

      if (response.ok) {
        const analysis = await response.json()
        setDetailedAnalysis(analysis)
      } else {
        console.error("Failed to fetch detailed analysis")
      }
    } catch (error) {
      console.error("Failed to fetch detailed analysis:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 获取实时价格数据
  const fetchCryptoPrices = async () => {
    setIsLoadingPrices(true)
    setConnectionStatus("loading")

    try {
      console.log("Fetching crypto prices...")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch("/api/crypto-prices", {
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const prices = await response.json()
        console.log("Fetched prices:", prices)

        if (Array.isArray(prices) && prices.length > 0) {
          setCryptoPrices(prices)
          setLastUpdated(new Date())
          setConnectionStatus("connected")
        } else {
          throw new Error("Empty or invalid price data")
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Failed to fetch crypto prices:", error)
      setConnectionStatus("disconnected")

      if (cryptoPrices.length === 0) {
        setCryptoPrices([])
      }
    } finally {
      setIsLoadingPrices(false)
    }
  }

  // 页面加载时获取价格数据
  useEffect(() => {
    fetchCryptoPrices()
    const interval = setInterval(fetchCryptoPrices, 15000)
    return () => clearInterval(interval)
  }, [])

  // Define startPrediction as a useCallback to be passed to CircularProgress
  const startPrediction = useCallback(async () => {
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol }),
      })

      if (response.ok) {
        const data = await response.json()
        setPrediction(data)
      } else if (response.status === 404) {
        const errorData = await response.json()
        setPredictionError(errorData.message || `未找到币种 ${symbol}`)
      } else {
        setPredictionError("预测失败，请稍后重试")
      }
    } catch (error) {
      console.error("Prediction failed:", error)
      setPredictionError("网络错误，请检查连接后重试")
    } finally {
      setIsPredicting(false)
    }
  }, [symbol, lang])

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol) return

    setIsPredicting(true)
    setPrediction(null)
    setDetailedAnalysis(null)
    setShowDetailedAnalysis(false)
    setPredictionError(null)
    setAnalysisRequested(false)

    // The actual prediction fetch will now be triggered by CircularProgress's onComplete
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  const formatPrice = (price: number) => {
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "apple-badge-success"
    if (confidence >= 0.5) return "apple-badge-warning"
    return "apple-badge-error"
  }

  const getLocalizedFeatures = () => {
    const featureTranslations = {
      "zh-CN": [
        { icon: <Cpu className="h-6 w-6" />, title: "AI 智能预测", description: "基于深度学习模型的精准价格预测" },
        { icon: <Shield className="h-6 w-6" />, title: "企业级安全", description: "银行级加密与数据保护" },
        { icon: <Globe className="h-6 w-6" />, title: "全球市场", description: "覆盖全球主要交易所实时数据" },
        { icon: <Layers className="h-6 w-6" />, title: "专业分析", description: "多维度技术与情绪分析" },
      ],
      "zh-TW": [
        { icon: <Cpu className="h-6 w-6" />, title: "AI 智能預測", description: "基於深度學習模型的精準價格預測" },
        { icon: <Shield className="h-6 w-6" />, title: "企業級安全", description: "銀行級加密與數據保護" },
        { icon: <Globe className="h-6 w-6" />, title: "全球市場", description: "覆蓋全球主要交易所即時數據" },
        { icon: <Layers className="h-6 w-6" />, title: "專業分析", description: "多維度技術與情緒分析" },
      ],
      en: [
        {
          icon: <Cpu className="h-6 w-6" />,
          title: "AI Intelligence",
          description: "Precise predictions powered by deep learning",
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "Enterprise Security",
          description: "Bank-grade encryption and data protection",
        },
        {
          icon: <Globe className="h-6 w-6" />,
          title: "Global Markets",
          description: "Real-time data from major exchanges worldwide",
        },
        {
          icon: <Layers className="h-6 w-6" />,
          title: "Professional Analysis",
          description: "Multi-dimensional technical and sentiment analysis",
        },
      ],
      ja: [
        {
          icon: <Cpu className="h-6 w-6" />,
          title: "AI インテリジェンス",
          description: "深層学習による精密な価格予測",
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "エンタープライズセキュリティ",
          description: "銀行レベルの暗号化とデータ保護",
        },
        {
          icon: <Globe className="h-6 w-6" />,
          title: "グローバル市場",
          description: "世界主要取引所のリアルタイムデータ",
        },
        {
          icon: <Layers className="h-6 w-6" />,
          title: "プロフェッショナル分析",
          description: "多次元技術・センチメント分析",
        },
      ],
      es: [
        {
          icon: <Cpu className="h-6 w-6" />,
          title: "Inteligencia AI",
          description: "Predicciones precisas con aprendizaje profundo",
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "Seguridad Empresarial",
          description: "Encriptación y protección de datos bancaria",
        },
        {
          icon: <Globe className="h-6 w-6" />,
          title: "Mercados Globales",
          description: "Datos en tiempo real de exchanges mundiales",
        },
        {
          icon: <Layers className="h-6 w-6" />,
          title: "Análisis Profesional",
          description: "Análisis técnico y de sentimiento multidimensional",
        },
      ],
    }
    return featureTranslations[lang] || featureTranslations["zh-CN"]
  }

  const localizedFeatures = getLocalizedFeatures()

  // 渲染工具调用状态
  const renderToolInvocations = (message: any) => {
    if (!message.toolInvocations) return null

    return (
      <div className="mt-3 space-y-2">
        {message.toolInvocations.map((tool: any, index: number) => (
          <div key={index} className="apple-card p-3 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
              {tool.toolName === "searchWeb" && <Search className="h-4 w-4" />}
              {tool.toolName === "getCryptoPrices" && <TrendingUp className="h-4 w-4" />}

              {tool.toolName === "searchWeb" && "🔍 网络搜索"}
              {tool.toolName === "getCryptoPrices" && "💰 获取实时价格"}
            </div>

            {tool.state === "loading" && (
              <div className="flex items-center gap-2 apple-body-secondary text-sm">
                <div className="apple-spinner"></div>
                正在
                {tool.toolName === "searchWeb" ? "搜索" : tool.toolName === "getCryptoPrices" ? "获取价格" : "获取信息"}
                ...
              </div>
            )}

            {tool.state === "complete" && tool.result && (
              <div className="apple-body-secondary text-sm">
                <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs font-mono">{tool.result.substring(0, 300)}...</pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderContent = (content: unknown): React.ReactNode => {
    if (typeof content === "string" || typeof content === "number") {
      return content.toString()
    }

    if (Array.isArray(content)) {
      return content.join(" | ")
    }

    if (typeof content === "object" && content !== null) {
      return Object.entries(content)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(" | ")
    }

    return String(content)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Risk Disclosure Banner */}
      <RiskDisclosureBanner lang={lang} />

      {/* Welcome Modal */}
      {showWelcomeModal && <WelcomeModal lang={lang} onClose={() => setShowWelcomeModal(false)} />}

      {/* 免责声明弹窗 */}
      <DisclaimerModal lang={lang} />

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 apple-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center p-2 shadow-lg">
                  <img src="/v2-logo.png" alt="V2 Logo" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="apple-headline flex items-center gap-2">
                  AI Agent
                  {chatMode === "deepsearch" && <Brain className="h-4 w-4 text-blue-600" title="深度推理模式" />}
                </h1>
              </div>
            </div>

            <LanguageSelector value={lang} onValueChange={setLang} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20 apple-slide-up">
          <div className="inline-flex items-center gap-3 apple-badge apple-badge-primary mb-8">
            <Wifi className="h-4 w-4 text-green-500" />
            {chatMode === "deepsearch" && <Brain className="h-4 w-4 text-blue-600" />}
            <span className="text-sm font-medium">
              {lang === "zh-CN" && "AI驱动的智能预测 • 实时联网"}
              {lang === "zh-TW" && "AI驅動的智能預測 • 即時聯網"}
              {lang === "en" && "AI-Powered Smart Prediction • Real-time Connected"}
              {lang === "ja" && "AI駆動のスマート予測 • リアルタイム接続"}
              {lang === "es" && "Predicción Inteligente con IA • Conectado en Tiempo Real"}
              {chatMode === "deepsearch" && " • Deep Reasoning"}
            </span>
          </div>

          <h1 className="apple-title-large mb-6 leading-tight">
            {lang === "zh-CN" && (
              <>
                下一代加密货币
                <br />
                <span className="text-blue-600">AI预测平台</span>
              </>
            )}
            {lang === "zh-TW" && (
              <>
                下一代加密貨幣
                <br />
                <span className="text-blue-600">AI預測平台</span>
              </>
            )}
            {lang === "en" && (
              <>
                Next-Gen Cryptocurrency
                <br />
                <span className="text-blue-600">AI Prediction Platform</span>
              </>
            )}
            {lang === "ja" && (
              <>
                次世代暗号通貨
                <br />
                <span className="text-blue-600">AI予測プラットフォーム</span>
              </>
            )}
            {lang === "es" && (
              <>
                Plataforma de Predicción
                <br />
                <span className="text-blue-600">AI de Criptomonedas</span>
              </>
            )}
          </h1>

          <p className="apple-body-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            {lang === "zh-CN" && "基于深度学习和大数据分析，为您提供最精准的加密货币价格预测和市场洞察"}
            {lang === "zh-TW" && "基於深度學習和大數據分析，為您提供最精準的加密貨幣價格預測和市場洞察"}
            {lang === "en" &&
              "Providing the most accurate cryptocurrency price predictions and market insights based on deep learning and big data analysis"}
            {lang === "ja" && "深層学習とビッグデータ分析に基づいて、最も正確な暗号通貨価格予測と市場洞察を提供"}
            {lang === "es" &&
              "Proporcionando las predicciones de precios de criptomonedas más precisas y perspectivas del mercado basadas en aprendizaje profundo y análisis de big data"}
          </p>
        </div>

        {/* Stats Section - 现在使用真实数据 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 apple-fade-in">
          <div className="apple-card apple-container-spacing text-center relative">
            <div className="text-3xl font-bold text-blue-600 mb-2 font-mono transition-all duration-500 ease-in-out">
              <CountUpNumber value={marketStats.totalPredictions} />
            </div>
            <p className="apple-body-secondary">
              {lang === "zh-CN" && "总预测次数"}
              {lang === "zh-TW" && "總預測次數"}
              {lang === "en" && "Total Predictions"}
              {lang === "ja" && "総予測回数"}
              {lang === "es" && "Predicciones Totales"}
            </p>
            {isLoadingStats && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <div className="apple-card apple-container-spacing text-center relative">
            <div className="text-3xl font-bold text-green-600 mb-2 font-mono transition-all duration-500 ease-in-out">
              {marketStats.predictionAccuracy.toFixed(1)}%
            </div>
            <p className="apple-body-secondary">
              {lang === "zh-CN" && "预测准确率"}
              {lang === "zh-TW" && "預測準確率"}
              {lang === "en" && "Prediction Accuracy"}
              {lang === "ja" && "予測精度"}
              {lang === "es" && "Precisión de Predicción"}
            </p>
            {isLoadingStats && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <div className="apple-card apple-container-spacing text-center relative">
            <div className="text-3xl font-bold text-purple-600 mb-2 font-mono transition-all duration-500 ease-in-out">
              <CountUpNumber value={marketStats.activeUsers} />
            </div>
            <p className="apple-body-secondary">
              {lang === "zh-CN" && "活跃用户"}
              {lang === "zh-TW" && "活躍用戶"}
              {lang === "en" && "Active Users"}
              {lang === "ja" && "アクティブユーザー"}
              {lang === "es" && "Usuarios Activos"}
            </p>
            {isLoadingStats && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 apple-fade-in">
          {localizedFeatures.map((feature, index) => (
            <div key={index} className="apple-card apple-container-spacing text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="apple-headline mb-3">{feature.title}</h3>
              <p className="apple-body-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Prediction & Chat */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prediction Card */}
            <div className="apple-card-elevated apple-container-spacing apple-scale-in">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="apple-headline">{t.cardTitle}</h2>
                </div>
              </div>

              <div className="space-y-6">
                <form onSubmit={handlePredict} className="flex gap-4">
                  <input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder={t.inputPlaceholder}
                    className="apple-input flex-1"
                  />
                  <button
                    type="submit"
                    disabled={isPredicting || !symbol}
                    className="apple-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPredicting ? t.predictingButton : t.predictButton}
                  </button>
                </form>

                {isPredicting && (
                  <CircularProgress
                    isActive={isPredicting}
                    onComplete={startPrediction}
                    duration={8000} // Adjust duration as needed
                    title={
                      lang === "zh-CN"
                        ? "AI智能预测中"
                        : lang === "zh-TW"
                          ? "AI智能預測中"
                          : lang === "en"
                            ? "AI Smart Prediction"
                            : lang === "ja"
                              ? "AIスマート予測中"
                              : "Predicción Inteligente AI"
                    }
                    subtitle={
                      lang === "zh-CN"
                        ? "正在深度分析市场数据..."
                        : lang === "zh-TW"
                          ? "正在深度分析市場數據..."
                          : lang === "en"
                            ? "Analyzing market data in depth..."
                            : lang === "ja"
                              ? "市場データを詳細分析中..."
                              : "Analizando datos del mercado en profundidad..."
                    }
                  />
                )}

                {/* 错误提示 */}
                {predictionError && (
                  <div className="apple-card border-red-200 bg-red-50 p-6 apple-fade-in">
                    <div className="flex items-center gap-3 text-red-600 mb-3">
                      <XCircle className="h-5 w-5" />
                      <span className="font-semibold">
                        {lang === "zh-CN" && "预测失败"}
                        {lang === "zh-TW" && "預測失敗"}
                        {lang === "en" && "Prediction Failed"}
                        {lang === "ja" && "予測失敗"}
                        {lang === "es" && "Predicción Fallida"}
                      </span>
                    </div>
                    <p className="apple-body-secondary mb-4">{predictionError}</p>
                    <button
                      onClick={() => {
                        setPredictionError(null)
                        setSymbol("")
                      }}
                      className="apple-button-secondary"
                    >
                      {lang === "zh-CN" && "重新输入"}
                      {lang === "zh-TW" && "重新輸入"}
                      {lang === "en" && "Try Again"}
                      {lang === "ja" && "再入力"}
                      {lang === "es" && "Intentar de Nuevo"}
                    </button>
                  </div>
                )}

                {prediction && (
                  <div className="space-y-6 apple-fade-in">
                    {/* 当前价格 */}
                    <div className="apple-card p-6">
                      <div className="flex items-center justify-between">
                        <span className="apple-body-secondary">
                          {lang === "zh-CN" && "当前实时价格"}
                          {lang === "zh-TW" && "當前即時價格"}
                          {lang === "en" && "Current Real-time Price"}
                          {lang === "ja" && "現在のリアルタイム価格"}
                          {lang === "es" && "Precio Actual en Tiempo Real"}
                        </span>
                        <span className="apple-title">${formatPrice(prediction.currentPrice)}</span>
                      </div>
                    </div>

                    {/* 预测结果 */}
                    <div className="apple-tabs">
                      <div
                        className={`apple-tab ${activePredictionTimeframe === "1h" ? "active" : ""}`}
                        onClick={() => setActivePredictionTimeframe("1h")}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {lang === "zh-CN" && "1小时"}
                        {lang === "zh-TW" && "1小時"}
                        {lang === "en" && "1 Hour"}
                        {lang === "ja" && "1時間"}
                        {lang === "es" && "1 Hora"}
                      </div>
                      <div
                        className={`apple-tab ${activePredictionTimeframe === "24h" ? "active" : ""}`}
                        onClick={() => setActivePredictionTimeframe("24h")}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {lang === "zh-CN" && "24小时"}
                        {lang === "zh-TW" && "24小時"}
                        {lang === "en" && "24 Hours"}
                        {lang === "ja" && "24時間"}
                        {lang === "es" && "24 Horas"}
                      </div>
                      <div
                        className={`apple-tab ${activePredictionTimeframe === "7d" ? "active" : ""}`}
                        onClick={() => setActivePredictionTimeframe("7d")}
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {lang === "zh-CN" && "7天"}
                        {lang === "zh-TW" && "7天"}
                        {lang === "en" && "7 Days"}
                        {lang === "ja" && "7日"}
                        {lang === "es" && "7 Días"}
                      </div>
                    </div>

                    <div className="apple-card p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="apple-body-secondary">{t.predictedPrice}</span>
                        <div className="flex items-center gap-3">
                          {getTrendIcon(prediction.predictions[activePredictionTimeframe].trend)}
                          <span
                            className={`apple-title ${getTrendColor(prediction.predictions[activePredictionTimeframe].trend)}`}
                          >
                            ${formatPrice(prediction.predictions[activePredictionTimeframe].price)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="apple-body-secondary">{t.confidence}</span>
                        <div
                          className={`apple-badge ${getConfidenceColor(prediction.predictions[activePredictionTimeframe].confidence)}`}
                        >
                          {(prediction.predictions[activePredictionTimeframe].confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* 基础分析报告 */}
                    <div className="apple-card p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="apple-headline">
                          {lang === "zh-CN" && "基础分析"}
                          {lang === "zh-TW" && "基礎分析"}
                          {lang === "en" && "Basic Analysis"}
                          {lang === "ja" && "基本分析"}
                          {lang === "es" && "Análisis Básico"}
                        </h4>
                        <button
                          onClick={() => {
                            setShowDetailedAnalysis(!showDetailedAnalysis)
                            if (!showDetailedAnalysis && !detailedAnalysis && !isAnalyzing && !analysisRequested) {
                              fetchDetailedAnalysis(prediction)
                            }
                          }}
                          className="apple-button-secondary text-sm"
                        >
                          {showDetailedAnalysis ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" />
                              {lang === "zh-CN" && "收起详细分析"}
                              {lang === "zh-TW" && "收起詳細分析"}
                              {lang === "en" && "Hide Detailed Analysis"}
                              {lang === "ja" && "詳細分析を隠す"}
                              {lang === "es" && "Ocultar Análisis Detallado"}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              {lang === "zh-CN" && "查看AI详细分析"}
                              {lang === "zh-TW" && "查看AI詳細分析"}
                              {lang === "en" && "View AI Detailed Analysis"}
                              {lang === "ja" && "AI詳細分析を表示"}
                              {lang === "es" && "Ver Análisis Detallado AI"}
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="apple-card bg-gray-50 p-4">
                          <span className="apple-body-secondary font-medium">
                            {lang === "zh-CN" && "技术分析："}
                            {lang === "zh-TW" && "技術分析："}
                            {lang === "en" && "Technical Analysis:"}
                            {lang === "ja" && "テクニカル分析："}
                            {lang === "es" && "Análisis Técnico:"}
                          </span>
                          <p className="apple-body mt-2 leading-relaxed">{prediction.analysis.technical}</p>
                        </div>

                        <div className="apple-card bg-gray-50 p-4">
                          <span className="apple-body-secondary font-medium">
                            {lang === "zh-CN" && "市场情绪："}
                            {lang === "zh-TW" && "市場情緒："}
                            {lang === "en" && "Market Sentiment:"}
                            {lang === "ja" && "市場センチメント："}
                            {lang === "es" && "Sentimiento del Mercado:"}
                          </span>
                          <p className="apple-body mt-2 leading-relaxed">{prediction.analysis.sentiment}</p>
                        </div>

                        <div className="apple-card bg-gray-50 p-4">
                          <span className="apple-body-secondary font-medium">
                            {lang === "zh-CN" && "风险评估："}
                            {lang === "zh-TW" && "風險評估："}
                            {lang === "en" && "Risk Assessment:"}
                            {lang === "ja" && "リスク評価："}
                            {lang === "es" && "Evaluación de Riesgo:"}
                          </span>
                          <p className="apple-body mt-2 leading-relaxed">{prediction.analysis.risk}</p>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <span className="apple-caption-small block mb-1">
                              {lang === "zh-CN" && "支撑位"}
                              {lang === "zh-TW" && "支撐位"}
                              {lang === "en" && "Support"}
                              {lang === "ja" && "サポート"}
                              {lang === "es" && "Soporte"}
                            </span>
                            <span className="apple-headline text-green-600">
                              ${formatPrice(prediction.analysis.support)}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="apple-caption-small block mb-1">
                              {lang === "zh-CN" && "阻力位"}
                              {lang === "zh-TW" && "阻力位"}
                              {lang === "en" && "Resistance"}
                              {lang === "ja" && "レジスタンス"}
                              {lang === "es" && "Resistencia"}
                            </span>
                            <span className="apple-headline text-red-600">
                              ${formatPrice(prediction.analysis.resistance)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 详细AI分析 */}
                    {showDetailedAnalysis && (
                      <div className="apple-card-elevated p-8 space-y-8 border-blue-200 apple-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-xl bg-blue-50">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 className="apple-headline">
                            {lang === "zh-CN" && "AI深度分析报告"}
                            {lang === "zh-TW" && "AI深度分析報告"}
                            {lang === "en" && "AI Deep Analysis Report"}
                            {lang === "ja" && "AI深度分析レポート"}
                            {lang === "es" && "Informe de Análisis Profundo AI"}
                          </h4>
                        </div>

                        {/* 圆形进度条 */}
                        {isAnalyzing && (
                          <CircularProgress
                            isActive={isAnalyzing}
                            onComplete={async () => {
                              try {
                                const response = await fetch("/api/analysis", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    prediction,
                                    lang,
                                  }),
                                })

                                if (response.ok) {
                                  const analysis = await response.json()
                                  setDetailedAnalysis(analysis)
                                }
                              } catch (error) {
                                console.error("Failed to fetch detailed analysis:", error)
                              } finally {
                                setIsAnalyzing(false)
                              }
                            }}
                            duration={8000}
                            title={
                              lang === "zh-CN"
                                ? "AI深度分析中"
                                : lang === "zh-TW"
                                  ? "AI深度分析中"
                                  : lang === "en"
                                    ? "AI Deep Analysis"
                                    : lang === "ja"
                                      ? "AI深度分析中"
                                      : "Análisis Profundo AI"
                            }
                            subtitle={
                              lang === "zh-CN"
                                ? "正在生成专业报告..."
                                : lang === "zh-TW"
                                  ? "正在生成專業報告..."
                                  : lang === "en"
                                    ? "Generating professional report..."
                                    : lang === "ja"
                                      ? "プロフェッショナルレポートを生成中..."
                                      : "Generando informe profesional..."
                            }
                          />
                        )}

                        {detailedAnalysis && !isAnalyzing && (
                          <div className="space-y-8 apple-fade-in">
                            {/* 技术分析 */}
                            <div className="space-y-4">
                              <h5 className="apple-headline text-blue-600 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                {lang === "zh-CN" && "技术分析"}
                                {lang === "zh-TW" && "技術分析"}
                                {lang === "en" && "Technical Analysis"}
                                {lang === "ja" && "テクニカル分析"}
                                {lang === "es" && "Análisis Técnico"}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("technicalIndicators")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.technicalAnalysis.indicators)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("supportResistance")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.technicalAnalysis.supportResistance)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("volume")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.technicalAnalysis.volume)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("patterns")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.technicalAnalysis.patterns)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* 基本面分析 */}
                            <div className="space-y-4">
                              <h5 className="apple-headline text-green-600 flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                {lang === "zh-CN" && "基本面分析"}
                                {lang === "zh-TW" && "基本面分析"}
                                {lang === "en" && "Fundamental Analysis"}
                                {lang === "ja" && "ファンダメンタル分析"}
                                {lang === "es" && "Análisis Fundamental"}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("projectFundamentals")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.fundamentalAnalysis.projectFundamentals)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("marketPosition")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.fundamentalAnalysis.marketPosition)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("recentNews")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.fundamentalAnalysis.recentNews)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("ecosystem")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.fundamentalAnalysis.ecosystem)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* 市场情绪分析 */}
                            <div className="space-y-4">
                              <h5 className="apple-headline text-purple-600 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                {lang === "zh-CN" && "市场情绪分析"}
                                {lang === "zh-TW" && "市場情緒分析"}
                                {lang === "en" && "Sentiment Analysis"}
                                {lang === "ja" && "センチメント分析"}
                                {lang === "es" && "Análisis de Sentimiento"}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("marketSentiment")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.sentimentAnalysis.marketSentiment)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("socialMedia")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.sentimentAnalysis.socialMedia)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("institutionalFlow")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.sentimentAnalysis.institutionalFlow)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("fearGreed")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.sentimentAnalysis.fearGreed)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* 投资建议 */}
                            <div className="space-y-4">
                              <h5 className="apple-headline text-orange-600 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                {lang === "zh-CN" && "投资建议"}
                                {lang === "zh-TW" && "投資建議"}
                                {lang === "en" && "Investment Advice"}
                                {lang === "ja" && "投資アドバイス"}
                                {lang === "es" && "Consejos de Inversión"}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("shortTerm")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.investmentAdvice.shortTerm)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("mediumTerm")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.investmentAdvice.mediumTerm)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("longTerm")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.investmentAdvice.longTerm)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("positionManagement")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.investmentAdvice.positionManagement)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* 风险评估 */}
                            <div className="space-y-4">
                              <h5 className="apple-headline text-red-600 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {lang === "zh-CN" && "风险评估"}
                                {lang === "zh-TW" && "風險評估"}
                                {lang === "en" && "Risk Assessment"}
                                {lang === "ja" && "リスク評価"}
                                {lang === "es" && "Evaluación de Riesgo"}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("riskFactors")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.riskAssessment.riskFactors)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("riskLevel")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.riskAssessment.riskLevel)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("mitigation")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.riskAssessment.mitigation)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* 宏观分析 */}
                            <div className="space-y-4">
                              <h5 className="apple-headline text-indigo-600 flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                {lang === "zh-CN" && "宏观分析"}
                                {lang === "zh-TW" && "宏觀分析"}
                                {lang === "en" && "Macro Analysis"}
                                {lang === "ja" && "マクロ分析"}
                                {lang === "es" && "Análisis Macro"}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("marketTrend")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.macroAnalysis.marketTrend)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("regulation")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.macroAnalysis.regulation)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("macroEconomic")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.macroAnalysis.macroEconomic)}
                                  </p>
                                </div>
                                <div className="apple-card bg-gray-50 p-4">
                                  <span className="apple-body-secondary font-medium">
                                    {getAnalysisLabel("fedPolicy")}：
                                  </span>
                                  <p className="apple-body mt-2 leading-relaxed">
                                    {renderContent(detailedAnalysis.macroAnalysis.fedPolicy)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {prediction && <LeverageRecommendation prediction={prediction} lang={lang} />}
              </div>
            </div>

            {/* AI Chat */}
            <div className="apple-card-elevated apple-container-spacing apple-scale-in">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    {chatMode === "deepsearch" && <Brain className="h-4 w-4 text-purple-600" />}
                    <h2 className="apple-headline">
                      {lang === "zh-CN" && "V2 AI助手对话"}
                      {lang === "zh-TW" && "V2 AI助手對話"}
                      {lang === "en" && "V2 AI Assistant Chat"}
                      {lang === "ja" && "V2 AIアシスタントチャット"}
                      {lang === "es" && "Chat del Asistente V2 AI"}
                      {chatMode === "deepsearch" && " • Deep Search"}
                    </h2>
                    <Wifi className="h-4 w-4 text-green-500" />
                  </div>

                  {/* 模式切换器 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChatMode(chatMode === "normal" ? "deepsearch" : "normal")}
                      className={`apple-button-secondary text-sm transition-all duration-300 ${
                        chatMode === "deepsearch"
                          ? "bg-purple-50 border-purple-200 text-purple-600"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {chatMode === "deepsearch" ? (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          {lang === "zh-CN" && "深度搜索"}
                          {lang === "zh-TW" && "深度搜索"}
                          {lang === "en" && "Deep Search"}
                          {lang === "ja" && "深度検索"}
                          {lang === "es" && "Búsqueda Profunda"}
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {lang === "zh-CN" && "普通模式"}
                          {lang === "zh-TW" && "普通模式"}
                          {lang === "en" && "Normal Mode"}
                          {lang === "ja" && "通常モード"}
                          {lang === "es" && "Modo Normal"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 模式说明 */}
                <div className="apple-caption-small mt-3">
                  {chatMode === "deepsearch" ? (
                    <div className="flex items-center gap-2 apple-card bg-purple-50 border-purple-200 p-3">
                      <Brain className="h-3 w-3 text-purple-600" />
                      <span>
                        {lang === "zh-CN" && "深度推理模式：使用DeepSeek Reasoner进行复杂逻辑分析"}
                        {lang === "zh-TW" && "深度推理模式：使用DeepSeek Reasoner進行複雜邏輯分析"}
                        {lang === "en" && "Deep Reasoning Mode: Using DeepSeek Reasoner for complex logical analysis"}
                        {lang === "ja" && "深度推理モード：DeepSeek Reasonerを使用した複雑な論理分析"}
                        {lang === "es" &&
                          "Modo de Razonamiento Profundo: Usando DeepSeek Reasoner para análisis lógico complejo"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 apple-card bg-gray-50 p-3">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                      <span>
                        {lang === "zh-CN" && "普通聊天模式：轻松幽默的对话风格，主动获取实时数据"}
                        {lang === "zh-TW" && "普通聊天模式：輕鬆幽默的對話風格，主動獲取即時數據"}
                        {lang === "en" &&
                          "Normal Chat Mode: Casual and humorous conversation style, proactively fetching real-time data"}
                        {lang === "ja" &&
                          "通常チャットモード：カジュアルでユーモラスな会話スタイル、リアルタイムデータを積極的に取得"}
                        {lang === "es" &&
                          "Modo de Chat Normal: Estilo de conversación casual y humorístico, obteniendo datos en tiempo real de forma proactiva"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="h-80 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} apple-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : chatMode === "deepsearch"
                              ? "apple-card border-purple-200 bg-purple-50"
                              : "apple-card bg-gray-50"
                        }`}
                      >
                        <p className="apple-body whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {renderToolInvocations(message)}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start apple-fade-in">
                      <div
                        className={`p-4 rounded-2xl ${
                          chatMode === "deepsearch"
                            ? "apple-card border-purple-200 bg-purple-50"
                            : "apple-card bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="apple-spinner"></div>
                          <span className="apple-body">
                            {chatMode === "deepsearch" ? (
                              <>
                                {lang === "zh-CN" && "V2正在深度思考..."}
                                {lang === "zh-TW" && "V2正在深度思考..."}
                                {lang === "en" && "V2 is deep thinking..."}
                                {lang === "ja" && "V2が深く考えています..."}
                                {lang === "es" && "V2 está pensando profundamente..."}
                              </>
                            ) : (
                              <>
                                {lang === "zh-CN" && "V2正在思考..."}
                                {lang === "zh-TW" && "V2正在思考..."}
                                {lang === "en" && "V2 is thinking..."}
                                {lang === "ja" && "V2が考えています..."}
                                {lang === "es" && "V2 está pensando..."}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={
                      chatMode === "deepsearch"
                        ? lang === "zh-CN"
                          ? "深度分析模式：问我复杂的市场问题..."
                          : lang === "zh-TW"
                            ? "深度分析模式：問我複雜的市場問題..."
                            : lang === "en"
                              ? "Deep Analysis Mode: Ask me complex market questions..."
                              : lang === "ja"
                                ? "深度分析モード：複雑な市場の質問をしてください..."
                                : "Modo de Análisis Profundo: Hazme preguntas complejas del mercado..."
                        : lang === "zh-CN"
                          ? "问我最新的比特币消息，我会主动获取数据！"
                          : lang === "zh-TW"
                            ? "問我最新的比特幣消息，我會主動獲取數據！"
                            : lang === "en"
                              ? "Ask me about latest Bitcoin news, I'll proactively get data!"
                              : lang === "ja"
                                ? "最新のビットコインニュースを聞いて、積極的にデータを取得します！"
                                : "¡Pregúntame sobre las últimas noticias de Bitcoin, obtendré datos de forma proactiva!"
                    }
                    className="apple-input flex-1"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`apple-button-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                      chatMode === "deepsearch" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <div className="apple-card-elevated apple-container-spacing apple-scale-in">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-orange-50">
                      <Star className="h-5 w-5 text-orange-600" />
                    </div>
                    <h2 className="apple-headline">
                      {lang === "zh-CN" && "实时价格排行榜"}
                      {lang === "zh-TW" && "即時價格排行榜"}
                      {lang === "en" && "Real-time Price Leaderboard"}
                      {lang === "ja" && "リアルタイム価格ランキング"}
                      {lang === "es" && "Tabla de Precios en Tiempo Real"}
                    </h2>
                  </div>
                  <button onClick={fetchCryptoPrices} disabled={isLoadingPrices} className="apple-button-secondary p-2">
                    <RefreshCw className={`h-4 w-4 ${isLoadingPrices ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* WiFi连接状态指示器 */}
                <div className="flex items-center justify-between">
                  <WifiIndicator
                    isConnected={connectionStatus === "connected"}
                    isLoading={connectionStatus === "loading"}
                    lang={lang}
                  />
                  {lastUpdated && connectionStatus === "connected" && (
                    <p className="apple-caption-small font-mono">{lastUpdated.toLocaleTimeString()}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-96 overflow-y-auto space-y-3">
                  {cryptoPrices.length > 0 ? (
                    cryptoPrices.map((crypto, index) => (
                      <div
                        key={crypto.symbol}
                        className="flex items-center justify-between p-4 rounded-xl apple-card bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                            {index + 1}
                          </div>
                          <div>
                            <div className="apple-body font-semibold group-hover:text-blue-600 transition-colors">
                              {crypto.name}
                            </div>
                            <div className="apple-caption-small font-mono text-gray-500">{crypto.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="apple-body font-semibold">
                            ${crypto.price > 0 ? formatPrice(crypto.price) : "N/A"}
                          </div>
                          <div
                            className={`apple-caption-small flex items-center gap-1 font-medium ${
                              crypto.change24h >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {crypto.change24h >= 0 ? "+" : ""}
                            {isNaN(crypto.change24h) ? "0.00" : crypto.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      {connectionStatus === "loading" ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="apple-spinner"></div>
                          <p className="apple-body-secondary">
                            {lang === "zh-CN" && "正在加载价格数据..."}
                            {lang === "zh-TW" && "正在載入價格數據..."}
                            {lang === "en" && "Loading price data..."}
                            {lang === "ja" && "価格データを読み込み中..."}
                            {lang === "es" && "Cargando datos de precios..."}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="apple-body-secondary text-red-600">
                            {lang === "zh-CN" && "价格数据加载失败"}
                            {lang === "zh-TW" && "價格數據載入失敗"}
                            {lang === "en" && "Failed to load price data"}
                            {lang === "ja" && "価格データの読み込みに失敗"}
                            {lang === "es" && "Error al cargar datos de precios"}
                          </p>
                          <button onClick={fetchCryptoPrices} className="apple-button-secondary">
                            {lang === "zh-CN" && "重试"}
                            {lang === "zh-TW" && "重試"}
                            {lang === "en" && "Retry"}
                            {lang === "ja" && "再試行"}
                            {lang === "es" && "Reintentar"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  )
}
