import { streamText, tool } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

// 简化的搜索函数
async function searchWeb(query: string) {
  try {
    const apiKey = process.env.TAVILY_API_KEY
    console.log("[Search] API Key exists:", !!apiKey)

    if (!apiKey) {
      return "❌ 搜索服务未配置，请联系管理员设置TAVILY_API_KEY"
    }

    console.log("[Search] Searching for:", query)

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        include_answer: true,
        max_results: 3,
        include_domains: ["coindesk.com", "cointelegraph.com", "decrypt.co", "theblock.co", "cryptonews.com"],
      }),
    })

    console.log("[Search] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Search] Error response:", errorText)
      return `❌ 搜索失败 (${response.status}): ${errorText}`
    }

    const data = await response.json()
    console.log("[Search] Success, found", data.results?.length || 0, "results")

    if (data.answer) {
      const results =
        data.results
          ?.slice(0, 2)
          .map((r) => `• ${r.title}: ${r.url}`)
          .join("\n") || ""
      return `🔍 搜索结果：\n\n${data.answer}\n\n📰 相关链接：\n${results}`
    }

    return "❌ 搜索完成但未找到相关信息"
  } catch (error) {
    console.error("[Search] Error:", error)
    return `❌ 搜索服务出错: ${error.message}`
  }
}

// 获取实时价格数据的函数
async function getRealTimePrices() {
  try {
    console.log("[Prices] Fetching real-time prices...")

    // 直接调用内部API
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,SOL,XRP,DOGE,ADA,AVAX&tsyms=USD&api_key=0be5d015a296fbe0a89f6319ff70df40aaf825135c07cb4e66dd70fd3ac33dd3",
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!data.RAW || !data.DISPLAY) {
      throw new Error("Invalid response structure")
    }

    const coins = ["BTC", "ETH", "BNB", "SOL", "XRP", "DOGE", "ADA", "AVAX"]
    const coinNames = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      BNB: "BNB",
      SOL: "Solana",
      XRP: "XRP",
      DOGE: "Dogecoin",
      ADA: "Cardano",
      AVAX: "Avalanche",
    }

    const prices = coins
      .map((symbol, index) => {
        const raw = data.RAW?.[symbol]?.USD
        const display = data.DISPLAY?.[symbol]?.USD

        if (!raw || !display) return null

        return {
          rank: index + 1,
          symbol,
          name: coinNames[symbol],
          price: raw.PRICE,
          change24h: raw.CHANGEPCT24HOUR || 0,
          volume: display.VOLUME24HOURTO || "N/A",
          marketCap: display.MKTCAP || "N/A",
        }
      })
      .filter(Boolean)

    const priceList = prices
      .map(
        (crypto) =>
          `${crypto.rank}. ${crypto.name} (${crypto.symbol}): $${crypto.price > 1 ? crypto.price.toLocaleString() : crypto.price.toFixed(6)} (${crypto.change24h >= 0 ? "+" : ""}${crypto.change24h.toFixed(2)}%)`,
      )
      .join("\n")

    return `📊 实时加密货币价格排行榜：\n\n${priceList}\n\n💡 数据实时更新`
  } catch (error) {
    console.error("[Prices] Error:", error)
    return `❌ 获取实时价格失败: ${error.message}`
  }
}

// 创建 DeepSeek 客户端
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "your-deepseek-api-key",
  baseURL: "https://api.deepseek.com",
})

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, mode = "normal" } = await req.json()

    console.log("[Chat API] Mode:", mode, "Messages count:", messages.length)

    // 根据模式选择不同的模型和系统提示
    const isDeepSearch = mode === "deepsearch"
    const model = isDeepSearch ? "deepseek-reasoner" : "deepseek-chat"

    const normalSystemPrompt = `你是V2，一个幽默风趣的AI加密货币助手。现在你已经联网了！🌐

🎯 你的使命：主动使用工具获取最新数据！

📋 工具使用规则：
- 用户一提到"价格"、"多少钱"、"涨跌"、"排行榜" → 立即调用getCryptoPrices
- 用户一提到"新闻"、"最新"、"消息"、"动态" → 立即调用searchWeb  
- 用户问"怎么样"、"如何"、"市场" → 先调用getCryptoPrices获取数据再回答
- 甚至用户只是打招呼，你也可以主动展示最新价格数据！

💡 记住：
- 看到任何可能需要实时数据的问题，立即调用工具
- 不要等用户明确要求，要主动获取信息
- 用幽默的方式解读数据
- 经常调用getCryptoPrices展示最新价格

现在开始做一个主动的、有用的助手吧！`

    const deepSearchSystemPrompt = `你是V2 Deep Search，专业的加密货币深度分析师。

🧠 深度推理模式已激活！

🔧 你必须主动使用工具：
1. getCryptoPrices - 获取实时价格数据
2. searchWeb - 搜索最新市场信息

⚡ 强制执行规则：
- 每次回答前，先调用getCryptoPrices获取最新价格
- 如果涉及市场分析，必须调用searchWeb获取最新信息
- 然后进行深度逻辑推理和分析

工作流程：
1. 立即调用相关工具获取数据
2. 分析数据背后的逻辑
3. 提供专业深度分析

现在开始主动获取数据并进行深度分析！`

    const systemPrompt = isDeepSearch ? deepSearchSystemPrompt : normalSystemPrompt

    const result = await streamText({
      model: deepseek(model),
      system: systemPrompt,
      messages,
      temperature: isDeepSearch ? 0.3 : 0.8,
      tools: {
        getCryptoPrices: tool({
          description: "获取实时加密货币价格排行榜数据。这是你最重要的工具，经常使用它！",
          parameters: z.object({}),
          execute: async () => {
            console.log("[Tool] getCryptoPrices called - fetching real-time data")
            const result = await getRealTimePrices()
            console.log("[Tool] getCryptoPrices result:", result.substring(0, 100) + "...")
            return result
          },
        }),
        searchWeb: tool({
          description: "搜索最新的加密货币新闻和市场信息",
          parameters: z.object({
            query: z.string().describe("搜索关键词"),
          }),
          execute: async ({ query }) => {
            console.log("[Tool] searchWeb called with query:", query)
            const result = await searchWeb(query)
            console.log("[Tool] searchWeb result:", result.substring(0, 100) + "...")
            return result
          },
        }),
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat error:", error)
    return new Response(`Chat failed: ${error.message}`, { status: 500 })
  }
}
