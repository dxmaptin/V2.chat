// Web search utilities using Tavily API
interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
  published_date?: string
}

interface TavilyResponse {
  query: string
  follow_up_questions?: string[]
  answer: string
  images: string[]
  results: TavilySearchResult[]
  response_time: number
}

export async function searchWeb(query: string, maxResults = 5): Promise<TavilyResponse | null> {
  try {
    const apiKey = process.env.TAVILY_API_KEY
    if (!apiKey) {
      console.error("Tavily API key not found")
      return null
    }

    console.log(`[Web Search] Searching for: ${query}`)

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_answer: true,
        include_images: false,
        include_raw_content: false,
        max_results: maxResults,
        include_domains: [
          "coindesk.com",
          "cointelegraph.com",
          "decrypt.co",
          "theblock.co",
          "cryptonews.com",
          "bitcoinmagazine.com",
          "news.bitcoin.com",
          "cryptoslate.com",
        ],
      }),
    })

    if (!response.ok) {
      console.error(`[Web Search] HTTP error: ${response.status}`)
      return null
    }

    const data = await response.json()
    console.log(`[Web Search] Found ${data.results?.length || 0} results`)
    return data
  } catch (error) {
    console.error("[Web Search] Error:", error)
    return null
  }
}

export async function getCryptoNews(symbol?: string): Promise<TavilyResponse | null> {
  const query = symbol
    ? `${symbol} cryptocurrency news latest updates price analysis`
    : "cryptocurrency market news bitcoin ethereum latest updates"

  return searchWeb(query, 8)
}

export async function getMarketAnalysis(topic: string): Promise<TavilyResponse | null> {
  const query = `cryptocurrency market analysis ${topic} expert opinion technical analysis`
  return searchWeb(query, 6)
}

export async function getRegulatoryNews(): Promise<TavilyResponse | null> {
  const query = "cryptocurrency regulation news SEC bitcoin ethereum legal updates"
  return searchWeb(query, 5)
}
