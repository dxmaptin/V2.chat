export type LanguageV2 = "en" | "zh-CN" | "zh-TW" | "es" | "ja"

export const translationsV2: {
  [key in LanguageV2]: {
    title: string
    subtitle: string
    cardTitle: string
    predictorTab: string
    leaderboardTab: string
    inputPlaceholder: string
    predictButton: string
    predictingButton: string
    predictedPrice: string
    confidence: string
    riskDisclosure: {
      title: string
      content: string
      dismiss: string
      learnMore: string
    }
    welcomeModal: {
      title: string
      subtitle: string
      description: string
      features: string[]
      getStarted: string
      skipIntro: string
    }
    footer: {
      trustedPartners: string
      partnersSubtitle: string
      platformName: string
      platformDescription: string
      copyright: string
      disclaimer: string
      technicalInfo: string
    }
    fallbackStrategies: {
      // New section for fallback strategy translations
      shortTermReasoningUp: string
      shortTermReasoningDown: string
      shortTermRiskWarning: string
      mediumTermReasoningUp: string
      mediumTermReasoningDown: string
      mediumTermRiskWarning: string
      conservativeArbitrageReasoning: string
      conservativeArbitrageRiskWarning: string
      aggressiveBreakoutReasoningUp: string
      aggressiveBreakoutReasoningDown: string
      aggressiveBreakoutRiskWarning: string
    }
  }
} = {
  "zh-CN": {
    title: "V2 AI预测",
    subtitle: "人工智能驱动的加密货币价格预测",
    cardTitle: "预测系统",
    predictorTab: "价格预测",
    leaderboardTab: "排行榜",
    inputPlaceholder: "输入货币代码 (例如, BTC)",
    predictButton: "开始预测",
    predictingButton: "预测中...",
    predictedPrice: "预测价格",
    confidence: "置信度",
    riskDisclosure: {
      title: "重要风险提示",
      content: "加密货币投资存在极高风险，价格波动剧烈。本平台数据仅供参考，不构成投资建议。请谨慎投资，风险自担。",
      dismiss: "我已了解",
      learnMore: "了解更多",
    },
    welcomeModal: {
      title: "欢迎来到 V2 AI Agent",
      subtitle: "下一代加密货币AI预测平台",
      description:
        "基于深度学习和大数据分析，为您提供最精准的加密货币价格预测和市场洞察。我们的AI助手V2将为您提供专业的投资建议和风险评估。",
      features: [
        "🤖 AI驱动的价格预测",
        "📊 实时市场数据分析",
        "⚡ 智能杠杆策略推荐",
        "🛡️ 专业风险评估",
        "🌍 多语言支持",
      ],
      getStarted: "开始体验",
      skipIntro: "跳过介绍",
    },
    footer: {
      trustedPartners: "信赖合作伙伴",
      partnersSubtitle: "由行业领先的技术合作伙伴提供支持",
      platformName: "加密货币智能预测平台",
      platformDescription: "本平台提供加密货币市场分析和预测，仅供参考。非投资建议。加密货币投资风险极高。",
      copyright: "V2 COMPANY 版权所有",
      disclaimer: "本平台提供加密货币市场分析和预测，仅供参考。非投资建议。加密货币投资风险极高。",
      technicalInfo: "AI驱动 • 实时数据 • 企业级安全",
    },
    fallbackStrategies: {
      shortTermReasoningUp:
        "基于1小时上涨趋势预测，{symbol}技术指标显示多头信号较强。采用{leverage}倍杠杆进行短期交易，预期价格上涨至${takeProfit}。止损设置在3%以严格控制风险。",
      shortTermReasoningDown:
        "基于1小时下跌趋势预测，{symbol}技术指标显示空头信号较强。采用{leverage}倍杠杆进行短期交易，预期价格下跌至${takeProfit}。止损设置在3%以严格控制风险。",
      shortTermRiskWarning:
        "短期杠杆交易波动性极大，价格可能快速反向波动导致爆仓。请严格执行止损，避免情绪化交易，建议仓位不超过总资金的10%。",
      mediumTermReasoningUp:
        "基于24小时上涨预测，结合技术面和基本面分析，{symbol}中期趋势向好。采用{leverage}倍杠杆进行波段交易，设置较宽止损空间以应对正常波动。",
      mediumTermReasoningDown:
        "基于24小时下跌预测，结合技术面和基本面分析，{symbol}中期趋势走弱。采用{leverage}倍杠杆进行波段交易，设置较宽止损空间以应对正常波动。",
      mediumTermRiskWarning:
        "中期杠杆交易需要承受更大的价格波动，市场可能出现意外事件影响趋势。建议密切关注市场动态，及时调整策略，控制总仓位规模。",
      conservativeArbitrageReasoning:
        "采用低杠杆套利策略，利用市场短期波动获取稳定收益。2倍杠杆降低风险，目标收益3%，止损2%。适合稳健型投资者，风险可控。",
      conservativeArbitrageRiskWarning:
        "虽然是保守策略，但杠杆交易仍存在本金损失风险。建议严格控制仓位，不要因为低杠杆而放松风险管理。",
      aggressiveBreakoutReasoningUp:
        "高杠杆突破策略，预期{symbol}将出现较大幅度上涨。采用{leverage}倍杠杆放大收益，目标收益15%，但风险相应增大。适合风险承受能力强的投资者。",
      aggressiveBreakoutReasoningDown:
        "高杠杆突破策略，预期{symbol}将出现较大幅度下跌。采用{leverage}倍杠杆放大收益，目标收益15%，但风险相应增大。适合风险承受能力强的投资者。",
      aggressiveBreakoutRiskWarning:
        "高杠杆策略风险极高，可能在短时间内损失大部分本金。市场波动可能导致快速爆仓，仅建议经验丰富的交易者使用，且仓位必须严格控制。",
    },
  },
  "zh-TW": {
    title: "V2 AI預測",
    subtitle: "人工智能驅動的加密貨幣價格預測",
    cardTitle: "預測系統",
    predictorTab: "價格預測",
    leaderboardTab: "排行榜",
    inputPlaceholder: "輸入貨幣代碼 (例如, BTC)",
    predictButton: "開始預測",
    predictingButton: "預測中...",
    predictedPrice: "預測價格",
    confidence: "信賴區間",
    riskDisclosure: {
      title: "重要風險提示",
      content: "加密貨幣投資存在極高風險，價格波動劇烈。本平台數據僅供參考，不構成投資建議。請謹慎投資，風險自擔。",
      dismiss: "我已了解",
      learnMore: "了解更多",
    },
    welcomeModal: {
      title: "歡迎來到 V2 AI Agent",
      subtitle: "下一代加密貨幣AI預測平台",
      description:
        "基於深度學習和大數據分析，為您提供最精準的加密貨幣價格預測和市場洞察。我們的AI助手V2將為您提供專業的投資建議和風險評估。",
      features: [
        "🤖 AI驅動的價格預測",
        "📊 即時市場數據分析",
        "⚡ 智能槓桿策略推薦",
        "🛡️ 專業風險評估",
        "🌍 多語言支援",
      ],
      getStarted: "開始體驗",
      skipIntro: "跳過介紹",
    },
    footer: {
      trustedPartners: "信賴合作夥伴",
      partnersSubtitle: "由行業領先的技術合作夥伴提供支援",
      platformName: "加密貨幣智能預測平台",
      platformDescription: "本平台提供加密貨幣市場分析和預測，僅供參考。非投資建議。加密貨幣投資風險極高。",
      copyright: "V2 COMPANY 版權所有",
      disclaimer: "本平台提供加密貨幣市場分析和預測，僅供參考。非投資建議。加密貨幣投資風險極高。",
      technicalInfo: "AI驅動 • 即時數據 • 企業級安全",
    },
    fallbackStrategies: {
      shortTermReasoningUp:
        "基於1小時上漲趨勢預測，{symbol}技術指標顯示多頭信號較強。採用{leverage}倍槓桿進行短期交易，預期價格上漲至${takeProfit}。止損設置在3%以嚴格控制風險。",
      shortTermReasoningDown:
        "基於1小時下跌趨勢預測，{symbol}技術指標顯示空頭信號較強。採用{leverage}倍槓桿進行短期交易，預期價格下跌至${takeProfit}。止損設置在3%以嚴格控制風險。",
      shortTermRiskWarning:
        "短期槓桿交易波動性極大，價格可能快速反向波動導致爆倉。請嚴格執行止損，避免情緒化交易，建議倉位不超過總資金的10%。",
      mediumTermReasoningUp:
        "基於24小時上漲預測，結合技術面和基本面分析，{symbol}中期趨勢向好。採用{leverage}倍槓桿進行波段交易，設置較寬止損空間以應對正常波動。",
      mediumTermReasoningDown:
        "基於24小時下跌預測，結合技術面和基本面分析，{symbol}中期趨勢走弱。採用{leverage}倍槓桿進行波段交易，設置較寬止損空間以應對正常波動。",
      mediumTermRiskWarning:
        "中期槓桿交易需要承受更大的價格波動，市場可能出現意外事件影響趨勢。建議密切關注市場動態，及時調整策略，控制總倉位規模。",
      conservativeArbitrageReasoning:
        "採用低槓桿套利策略，利用市場短期波動獲取穩定收益。2倍槓桿降低風險，目標收益3%，止損2%。適合穩健型投資者，風險可控。",
      conservativeArbitrageRiskWarning:
        "雖然是保守策略，但槓桿交易仍存在本金損失風險。建議嚴格控制倉位，不要因為低槓桿而放鬆風險管理。",
      aggressiveBreakoutReasoningUp:
        "高槓桿突破策略，預期{symbol}將出現較大幅度上漲。採用{leverage}倍槓桿放大收益，目標收益15%，但風險相應增大。適合風險承受能力強的投資者。",
      aggressiveBreakoutReasoningDown:
        "高槓桿突破策略，預期{symbol}將出現較大幅度下跌。採用{leverage}倍槓桿放大收益，目標收益15%，但風險相應增大。適合風險承受能力強的投資者。",
      aggressiveBreakoutRiskWarning:
        "高槓桿策略風險極高，可能在短時間內損失大部分本金。市場波動可能導致快速爆倉，僅建議經驗豐富的交易者使用，且倉位必須嚴格控制。",
    },
  },
  en: {
    title: "V2 AI Predict",
    subtitle: "AI-Powered Cryptocurrency Price Forecasting",
    cardTitle: "Prediction System",
    predictorTab: "Price Prediction",
    leaderboardTab: "Leaderboard",
    inputPlaceholder: "Enter Symbol (e.g., BTC)",
    predictButton: "Start Prediction",
    predictingButton: "Predicting...",
    predictedPrice: "Predicted Price",
    confidence: "Confidence",
    riskDisclosure: {
      title: "Important Risk Disclosure",
      content:
        "Cryptocurrency investments carry extremely high risks with volatile price fluctuations. Platform data is for reference only and does not constitute investment advice. Please invest cautiously at your own risk.",
      dismiss: "I Understand",
      learnMore: "Learn More",
    },
    welcomeModal: {
      title: "Welcome to V2 AI Agent",
      subtitle: "Next-Generation Cryptocurrency AI Prediction Platform",
      description:
        "Providing the most accurate cryptocurrency price predictions and market insights based on deep learning and big data analysis. Our AI assistant V2 will provide you with professional investment advice and risk assessment.",
      features: [
        "🤖 AI-Driven Price Predictions",
        "📊 Real-time Market Data Analysis",
        "⚡ Smart Leverage Strategy Recommendations",
        "🛡️ Professional Risk Assessment",
        "🌍 Multi-language Support",
      ],
      getStarted: "Get Started",
      skipIntro: "Skip Intro",
    },
    footer: {
      trustedPartners: "Trusted Partners",
      partnersSubtitle: "Powered by industry-leading technology partners",
      platformName: "Cryptocurrency AI Prediction Platform",
      platformDescription:
        "This platform provides cryptocurrency market analysis and predictions for informational purposes only. Not financial advice. Cryptocurrency investments carry high risk.",
      copyright: "V2 COMPANY. All rights reserved",
      disclaimer:
        "This platform provides cryptocurrency market analysis and predictions for informational purposes only. Not financial advice. Cryptocurrency investments carry high risk.",
      technicalInfo: "Powered by AI • Real-time Data • Enterprise Security",
    },
    fallbackStrategies: {
      shortTermReasoningUp:
        "Based on 1-hour upward trend prediction, {symbol} technical indicators show strong bullish signals. Using {leverage}x leverage for short-term trading, expected price to rise to ${takeProfit}. Stop-loss set at 3% to strictly control risk.",
      shortTermReasoningDown:
        "Based on 1-hour downward trend prediction, {symbol} technical indicators show strong bearish signals. Using {leverage}x leverage for short-term trading, expected price to fall to ${takeProfit}. Stop-loss set at 3% to strictly control risk.",
      shortTermRiskWarning:
        "Short-term leveraged trading is highly volatile, and prices can quickly reverse, leading to liquidation. Please strictly execute stop-loss, avoid emotional trading, and it is recommended that positions do not exceed 10% of total funds.",
      mediumTermReasoningUp:
        "Based on 24-hour upward prediction, combined with technical and fundamental analysis, {symbol} medium-term trend is positive. Using {leverage}x leverage for swing trading, setting wider stop-loss space to cope with normal fluctuations.",
      mediumTermReasoningDown:
        "Based on 24-hour downward prediction, combined with technical and fundamental analysis, {symbol} medium-term trend is weakening. Using {leverage}x leverage for swing trading, setting wider stop-loss space to cope with normal fluctuations.",
      mediumTermRiskWarning:
        "Medium-term leveraged trading requires enduring greater price fluctuations, and unexpected market events may affect trends. It is recommended to closely monitor market dynamics, adjust strategies in time, and control the overall position size.",
      conservativeArbitrageReasoning:
        "Adopting a low-leverage arbitrage strategy to gain stable returns from short-term market fluctuations. 2x leverage reduces risk, target return 3%, stop-loss 2%. Suitable for conservative investors, with controllable risk.",
      conservativeArbitrageRiskWarning:
        "Although it is a conservative strategy, leveraged trading still carries the risk of principal loss. It is recommended to strictly control positions and not relax risk management due to low leverage.",
      aggressiveBreakoutReasoningUp:
        "High-leverage breakout strategy, expecting {symbol} to have a significant upward movement. Using {leverage}x leverage to amplify returns, target return 15%, but risk increases accordingly. Suitable for investors with high-risk tolerance.",
      aggressiveBreakoutReasoningDown:
        "High-leverage breakout strategy, expecting {symbol} to have a significant downward movement. Using {leverage}x leverage to amplify returns, target return 15%, but risk increases accordingly. Suitable for investors with high-risk tolerance.",
      aggressiveBreakoutRiskWarning:
        "High-leverage strategies carry extremely high risks and may result in significant principal loss in a short period. Market fluctuations can lead to rapid liquidation. Only recommended for experienced traders, and positions must be strictly controlled.",
    },
  },
  es: {
    title: "V2 AI Predicción",
    subtitle: "Pronóstico de Precios de Criptomonedas con IA",
    cardTitle: "Sistema de Predicción",
    predictorTab: "Predicción de Precios",
    leaderboardTab: "Tabla de Posiciones",
    inputPlaceholder: "Ingrese Símbolo (ej., BTC)",
    predictButton: "Iniciar Predicción",
    predictingButton: "Prediciendo...",
    predictedPrice: "Precio Predicho",
    confidence: "Confianza",
    riskDisclosure: {
      title: "Divulgación Importante de Riesgo",
      content:
        "Las inversiones en criptomonedas conllevan riesgos extremadamente altos con fluctuaciones de precios volátiles. Los datos de la plataforma son solo para referencia y no constituyen asesoramiento de inversión. Por favor, invierta con precaución bajo su propio riesgo.",
      dismiss: "Entiendo",
      learnMore: "Saber Más",
    },
    welcomeModal: {
      title: "Bienvenido a V2 AI Agent",
      subtitle: "Plataforma de Predicción AI de Criptomonedas de Nueva Generación",
      description:
        "Proporcionando las predicciones de precios de criptomonedas más precisas y perspectivas del mercado basadas en aprendizaje profundo y análisis de big data. Nuestro asistente AI V2 le proporcionará asesoramiento de inversión profesional y evaluación de riesgos.",
      features: [
        "🤖 Predicciones de Precios Impulsadas por IA",
        "📊 Análisis de Datos de Mercado en Tiempo Real",
        "⚡ Recomendaciones de Estrategia de Apalancamiento Inteligente",
        "🛡️ Evaluación de Riesgo Profesional",
        "🌍 Soporte Multiidioma",
      ],
      getStarted: "Comenzar",
      skipIntro: "Saltar Introducción",
    },
    footer: {
      trustedPartners: "Socios de Confianza",
      partnersSubtitle: "Impulsado por socios tecnológicos líderes en la industria",
      platformName: "Plataforma de Predicción AI de Criptomonedas",
      platformDescription:
        "Esta plataforma proporciona análisis y predicciones del mercado de criptomonedas solo con fines informativos. No es asesoramiento financiero. Las inversiones en criptomonedas conllevan alto riesgo.",
      copyright: "V2 COMPANY. Todos los derechos reservados",
      disclaimer:
        "Esta plataforma proporciona análisis y predicciones del mercado de criptomonedas solo con fines informativos. No es asesoramiento financiero. Las inversiones en criptomonedas conllevan alto riesgo.",
      technicalInfo: "Impulsado por IA • Datos en Tiempo Real • Seguridad Empresarial",
    },
    fallbackStrategies: {
      shortTermReasoningUp:
        "Basado en la predicción de tendencia alcista de 1 hora, los indicadores técnicos de {symbol} muestran fuertes señales alcistas. Usando {leverage}x de apalancamiento para el trading a corto plazo, se espera que el precio suba a ${takeProfit}. Stop-loss establecido en 3% para controlar estrictamente el riesgo.",
      shortTermReasoningDown:
        "Basado en la predicción de tendencia bajista de 1 hora, los indicadores técnicos de {symbol} muestran fuertes señales bajistas. Usando {leverage}x de apalancamiento para el trading a corto plazo, se espera que el precio baje a ${takeProfit}. Stop-loss establecido en 3% para controlar estrictamente el riesgo.",
      shortTermRiskWarning:
        "El trading apalancado a corto plazo es altamente volátil, y los precios pueden revertirse rápidamente, lo que lleva a la liquidación. Por favor, ejecute estrictamente el stop-loss, evite el trading emocional y se recomienda que las posiciones no superen el 10% de los fondos totales.",
      mediumTermReasoningUp:
        "Basado en la predicción alcista de 24 horas, combinado con análisis técnico y fundamental, la tendencia a medio plazo de {symbol} es positiva. Usando {leverage}x de apalancamiento para el trading de swing, estableciendo un espacio de stop-loss más amplio para hacer frente a las fluctuaciones normales.",
      mediumTermReasoningDown:
        "Basado en la predicción bajista de 24 horas, combinado con análisis técnico y fundamental, la tendencia a medio plazo de {symbol} se está debilitando. Usando {leverage}x de apalancamiento para el trading de swing, estableciendo un espacio de stop-loss más amplio para hacer frente a las fluctuaciones normales.",
      mediumTermRiskWarning:
        "El trading apalancado a medio plazo requiere soportar mayores fluctuaciones de precios, y eventos inesperados del mercado pueden afectar las tendencias. Se recomienda monitorear de cerca la dinámica del mercado, ajustar las estrategias a tiempo y controlar el tamaño total de la posición.",
      conservativeArbitrageReasoning:
        "Adoptando una estrategia de arbitraje de bajo apalancamiento para obtener rendimientos estables de las fluctuaciones del mercado a corto plazo. El apalancamiento de 2x reduce el riesgo, el rendimiento objetivo es del 3%, el stop-loss es del 2%. Adecuado para inversores conservadores, con riesgo controlable.",
      conservativeArbitrageRiskWarning:
        "Aunque es una estrategia conservadora, el trading apalancado aún conlleva el riesgo de pérdida de capital. Se recomienda controlar estrictamente las posiciones y no relajar la gestión de riesgos debido al bajo apalancamiento.",
      aggressiveBreakoutReasoningUp:
        "Estrategia de ruptura de alto apalancamiento, esperando que {symbol} tenga un movimiento alcista significativo. Usando {leverage}x de apalancamiento para amplificar los rendimientos, el rendimiento objetivo es del 15%, pero el riesgo aumenta en consecuencia. Adecuado para inversores con alta tolerancia al riesgo.",
      aggressiveBreakoutReasoningDown:
        "Estrategia de ruptura de alto apalancamiento, esperando que {symbol} tenga un movimiento bajista significativo. Usando {leverage}x de apalancamiento para amplificar los rendimientos, el rendimiento objetivo es del 15%, pero el riesgo aumenta en consecuencia. Adecuado para inversores con alta tolerancia al riesgo.",
      aggressiveBreakoutRiskWarning:
        "Las estrategias de alto apalancamiento conllevan riesgos extremadamente altos y pueden resultar en una pérdida significativa de capital en un corto período. Las fluctuaciones del mercado pueden llevar a una liquidación rápida. Solo se recomienda para traders experimentados, y las posiciones deben controlarse estrictamente.",
    },
  },
  ja: {
    title: "V2 AI予測",
    subtitle: "AIによる暗号通貨価格予測",
    cardTitle: "予測システム",
    predictorTab: "価格予測",
    leaderboardTab: "ランキング",
    inputPlaceholder: "シンボルを入力 (例: BTC)",
    predictButton: "予測開始",
    predictingButton: "予測中...",
    predictedPrice: "予測価格",
    confidence: "信頼度",
    riskDisclosure: {
      title: "重要なリスク開示",
      content:
        "暗号通貨投資は極めて高いリスクを伴い、価格変動が激しいです。プラットフォームのデータは参考のみであり、投資アドバイスを構成するものではありません。自己責任で慎重に投資してください。",
      dismiss: "理解しました",
      learnMore: "詳細を見る",
    },
    welcomeModal: {
      title: "V2 AI Agentへようこそ",
      subtitle: "次世代暗号通貨AI予測プラットフォーム",
      description:
        "深層学習とビッグデータ分析に基づいて、最も正確な暗号通貨価格予測と市場洞察を提供します。AIアシスタントV2が専門的な投資アドバイスとリスク評価を提供します。",
      features: [
        "🤖 AI駆動の価格予測",
        "📊 リアルタイム市場データ分析",
        "⚡ スマートレバレッジ戦略推奨",
        "🛡️ プロフェッショナルリスク評価",
        "🌍 多言語サポート",
      ],
      getStarted: "始める",
      skipIntro: "イントロをスキップ",
    },
    footer: {
      trustedPartners: "信頼できるパートナー",
      partnersSubtitle: "業界をリードする技術パートナーによって支えられています",
      platformName: "暗号通貨AI予測プラットフォーム",
      platformDescription:
        "このプラットフォームは情報提供のみを目的として暗号通貨市場の分析と予測を提供します。投資アドバイスではありません。暗号通貨投資は高いリスクを伴います。",
      copyright: "V2 COMPANY. 全著作権所有",
      disclaimer:
        "このプラットフォームは情報提供のみを目的として暗号通貨市場の分析と予測を提供します。投資アドバイスではありません。暗号通貨投資は高いリスクを伴います。",
      technicalInfo: "AIによる支援 • リアルタイムデータ • エンタープライズセキュリティ",
    },
    fallbackStrategies: {
      shortTermReasoningUp:
        "1時間の上昇トレンド予測に基づき、{symbol}のテクニカル指標は強い強気シグナルを示しています。短期取引に{leverage}倍のレバレッジを使用し、価格は${takeProfit}まで上昇すると予想されます。リスクを厳密に管理するため、ストップロスは3%に設定されています。",
      shortTermReasoningDown:
        "1時間の下落トレンド予測に基づき、{symbol}のテクニカル指標は強い弱気シグナルを示しています。短期取引に{leverage}倍のレバレッジを使用し、価格は${takeProfit}まで下落すると予想されます。リスクを厳密に管理するため、ストップロスは3%に設定されています。",
      shortTermRiskWarning:
        "短期レバレッジ取引は非常に変動が激しく、価格が急速に反転し、清算につながる可能性があります。ストップロスを厳密に実行し、感情的な取引を避け、総資金の10%を超えないポジションを推奨します。",
      mediumTermReasoningUp:
        "24時間の上昇予測に基づき、テクニカル分析とファンダメンタル分析を組み合わせると、{symbol}の中期トレンドは良好です。スイングトレードに{leverage}倍のレバレッジを使用し、通常の変動に対応するために広いストップロススペースを設定します。",
      mediumTermReasoningDown:
        "24時間の下落予測に基づき、テクニカル分析とファンダメンタル分析を組み合わせると、{symbol}の中期トレンドは弱まっています。スイングトレードに{leverage}倍のレバレッジを使用し、通常の変動に対応するために広いストップロススペースを設定します。",
      mediumTermRiskWarning:
        "中期レバレッジ取引はより大きな価格変動に耐える必要があり、予期せぬ市場イベントがトレンドに影響を与える可能性があります。市場の動向を密接に監視し、戦略を適時に調整し、全体的なポジションサイズを管理することをお勧めします。",
      conservativeArbitrageReasoning:
        "低レバレッジの裁定取引戦略を採用し、短期的な市場変動から安定した収益を得ます。2倍のレバレッジでリスクを軽減し、目標収益は3%、ストップロスは2%です。保守的な投資家向けで、リスクは管理可能です。",
      conservativeArbitrageRiskWarning:
        "保守的な戦略であっても、レバレッジ取引には元本損失のリスクがあります。ポジションを厳密に管理し、低レバレッジだからといってリスク管理を怠らないことをお勧めします。",
      aggressiveBreakoutReasoningUp:
        "高レバレッジのブレイクアウト戦略で、{symbol}が大幅に上昇すると予想されます。{leverage}倍のレバレッジを使用して収益を拡大し、目標収益は15%ですが、リスクもそれに応じて増加します。高リスク許容度を持つ投資家向けです。",
      aggressiveBreakoutReasoningDown:
        "高レバレッジのブレイクアウト戦略で、{symbol}が大幅に下落すると予想されます。{leverage}倍のレバレッジを使用して収益を拡大し、目標収益は15%ですが、リスクもそれに応じて増加します。高リスク許容度を持つ投資家向けです。",
      aggressiveBreakoutRiskWarning:
        "高レバレッジ戦略は極めて高いリスクを伴い、短期間で元本の大部分を失う可能性があります。市場の変動により急速な清算が発生する可能性があります。経験豊富なトレーダーのみに推奨され、ポジションは厳密に管理する必要があります。",
    },
  },
}
