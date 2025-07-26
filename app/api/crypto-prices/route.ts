export const maxDuration = 30

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: string
  marketCap: string
}

// CryptoCompare支持的币种符号
const COINS = {
  BTC: { symbol: "BTC", name: "Bitcoin" },
  ETH: { symbol: "ETH", name: "Ethereum" },
  BNB: { symbol: "BNB", name: "BNB" },
  SOL: { symbol: "SOL", name: "Solana" },
  XRP: { symbol: "XRP", name: "XRP" },
  DOGE: { symbol: "DOGE", name: "Dogecoin" },
  ADA: { symbol: "ADA", name: "Cardano" },
  AVAX: { symbol: "AVAX", name: "Avalanche" },
} as const

type SymbolKey = keyof typeof COINS

export async function GET() {
  console.log("[API] Starting crypto price fetch...")

  try {
    // 1. 尝试CryptoCompare API
    const cryptoCompareData = await fetchFromCryptoCompare()
    if (cryptoCompareData.length >= 6) {
      // 至少获取到6个币种的数据
      console.log("[API] Using CryptoCompare data")
      return Response.json(cryptoCompareData)
    }

    // 2. 备选：CoinPaprika API
    console.log("[API] CryptoCompare insufficient, trying CoinPaprika...")
    const paprikaData = await fetchFromPaprika()
    if (paprikaData.length > 0) {
      const merged = mergePriceSets(cryptoCompareData, paprikaData)
      console.log("[API] Using merged data")
      return Response.json(merged)
    }

    // 3. 最后备选：模拟数据
    console.log("[API] All APIs failed, using mock data")
    return Response.json(generateMockPrices())
  } catch (error) {
    console.error("[API] Fatal error:", error)
    return Response.json(generateMockPrices())
  }
}

async function fetchFromCryptoCompare(): Promise<CryptoPrice[]> {
  try {
    const symbols = Object.keys(COINS).join(",")
    const apiKey =
      process.env.CRYPTOCOMPARE_API_KEY || "0be5d015a296fbe0a89f6319ff70df40aaf825135c07cb4e66dd70fd3ac33dd3"
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols}&tsyms=USD&api_key=${apiKey}`

    console.log("[CryptoCompare] Fetching from:", url)

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Apikey ${apiKey}`,
      },
      timeout: 10000, // 10秒超时
    })

    if (!response.ok) {
      console.error(`[CryptoCompare] HTTP error: ${response.status} ${response.statusText}`)
      throw new Error(`CryptoCompare API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[CryptoCompare] Response:", data)

    if (data.Response === "Error") {
      console.error(`[CryptoCompare] API error: ${data.Message}`)
      throw new Error(`CryptoCompare API error: ${data.Message}`)
    }

    if (!data.RAW || !data.DISPLAY) {
      console.error("[CryptoCompare] Invalid response structure")
      throw new Error("Invalid response structure")
    }

    const rawData = data.RAW
    const displayData = data.DISPLAY

    const results = (Object.keys(COINS) as SymbolKey[])
      .map((symbol) => {
        const raw = rawData?.[symbol]?.USD
        const display = displayData?.[symbol]?.USD

        if (!raw || typeof raw.PRICE !== "number" || raw.PRICE <= 0) {
          console.warn(`[CryptoCompare] Invalid data for ${symbol}:`, raw)
          return null
        }

        return {
          symbol,
          name: COINS[symbol].name,
          price: raw.PRICE,
          change24h: raw.CHANGEPCT24HOUR || 0,
          volume24h: display?.VOLUME24HOURTO || format(raw.VOLUME24HOURTO || 0),
          marketCap: display?.MKTCAP || format(raw.MKTCAP || 0),
        }
      })
      .filter(Boolean) as CryptoPrice[]

    console.log(`[CryptoCompare] Successfully fetched ${results.length} prices`)
    return results
  } catch (error) {
    console.error("[CryptoCompare] fetch failed:", error)
    return []
  }
}

async function fetchFromPaprika(): Promise<CryptoPrice[]> {
  try {
    console.log("[CoinPaprika] Fetching data...")

    const response = await fetch("https://api.coinpaprika.com/v1/tickers?quotes=USD&limit=100", {
      cache: "no-store",
      timeout: 10000,
    })

    if (!response.ok) {
      console.error(`[CoinPaprika] HTTP error: ${response.status}`)
      throw new Error(`CoinPaprika API error: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format")
    }

    const results = (Object.keys(COINS) as SymbolKey[])
      .map((symbol) => {
        const coin = data.find((item: any) => item.symbol === symbol && item.quotes?.USD?.price > 0)

        if (!coin || !coin.quotes?.USD) {
          console.warn(`[CoinPaprika] No valid data for ${symbol}`)
          return null
        }

        const usd = coin.quotes.USD
        return {
          symbol,
          name: COINS[symbol].name,
          price: usd.price,
          change24h: usd.percent_change_24h || 0,
          volume24h: format(usd.volume_24h || 0),
          marketCap: format(usd.market_cap || 0),
        }
      })
      .filter(Boolean) as CryptoPrice[]

    console.log(`[CoinPaprika] Successfully fetched ${results.length} prices`)
    return results
  } catch (error) {
    console.error("[CoinPaprika] fetch failed:", error)
    return []
  }
}

function mergePriceSets(primary: CryptoPrice[], fallback: CryptoPrice[]): CryptoPrice[] {
  const map = new Map(primary.map((p) => [p.symbol, p]))
  fallback.forEach((p) => {
    if (!map.has(p.symbol)) {
      map.set(p.symbol, p)
    }
  })

  return (Object.keys(COINS) as SymbolKey[]).map((symbol) => map.get(symbol)).filter(Boolean) as CryptoPrice[]
}

function generateMockPrices(): CryptoPrice[] {
  const mockPrices = {
    BTC: 67000,
    ETH: 3800,
    BNB: 630,
    SOL: 170,
    XRP: 2.1,
    DOGE: 0.38,
    ADA: 1.05,
    AVAX: 42,
  }

  return (Object.keys(COINS) as SymbolKey[]).map((symbol) => ({
    symbol,
    name: COINS[symbol].name,
    price: mockPrices[symbol] * (0.95 + Math.random() * 0.1),
    change24h: (Math.random() - 0.5) * 10,
    volume24h: format(Math.random() * 2e10),
    marketCap: format(Math.random() * 1e12),
  }))
}

function format(n: number | string): string {
  const num = typeof n === "string" ? Number.parseFloat(n) : n
  if (isNaN(num) || num === 0) return "0"
  if (num >= 1e12) return (num / 1e12).toFixed(1) + "T"
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B"
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M"
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K"
  return num.toFixed(2)
}
