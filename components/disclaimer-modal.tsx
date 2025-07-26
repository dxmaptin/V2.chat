"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import type { LanguageV2 } from "@/lib/i18n-v2"

interface DisclaimerModalProps {
  lang: LanguageV2
}

export function DisclaimerModal({ lang }: DisclaimerModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasAccepted = localStorage.getItem("v2-disclaimer-accepted")
    if (!hasAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("v2-disclaimer-accepted", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  const getDisclaimerText = () => {
    const disclaimers = {
      "zh-CN": {
        title: "重要免责声明",
        content: [
          "本平台提供的所有数据、预测和分析仅供参考，不构成投资建议。",
          "加密货币市场具有极高风险和波动性，价格可能大幅波动。",
          "AI预测基于历史数据和算法模型，无法保证准确性。",
          "杠杆交易风险极高，可能导致全部资金损失。",
          "用户应根据自身风险承受能力谨慎投资，本平台不承担任何投资损失责任。",
          "请在充分了解风险的前提下使用本平台服务。",
        ],
        accept: "我已阅读并同意",
        warning: "风险提示",
      },
      "zh-TW": {
        title: "重要免責聲明",
        content: [
          "本平台提供的所有數據、預測和分析僅供參考，不構成投資建議。",
          "加密貨幣市場具有極高風險和波動性，價格可能大幅波動。",
          "AI預測基於歷史數據和算法模型，無法保證準確性。",
          "槓桿交易風險極高，可能導致全部資金損失。",
          "用戶應根據自身風險承受能力謹慎投資，本平台不承擔任何投資損失責任。",
          "請在充分了解風險的前提下使用本平台服務。",
        ],
        accept: "我已閱讀並同意",
        warning: "風險提示",
      },
      en: {
        title: "Important Disclaimer",
        content: [
          "All data, predictions and analysis provided by this platform are for reference only and do not constitute investment advice.",
          "Cryptocurrency markets are extremely risky and volatile, prices may fluctuate significantly.",
          "AI predictions are based on historical data and algorithmic models, accuracy cannot be guaranteed.",
          "Leverage trading is extremely risky and may result in total loss of funds.",
          "Users should invest cautiously based on their own risk tolerance. This platform assumes no responsibility for any investment losses.",
          "Please use this platform's services with full understanding of the risks involved.",
        ],
        accept: "I have read and agree",
        warning: "Risk Warning",
      },
      ja: {
        title: "重要な免責事項",
        content: [
          "本プラットフォームが提供するすべてのデータ、予測、分析は参考のみであり、投資アドバイスを構成するものではありません。",
          "暗号通貨市場は極めて高いリスクとボラティリティを持ち、価格は大幅に変動する可能性があります。",
          "AI予測は過去のデータとアルゴリズムモデルに基づいており、正確性は保証できません。",
          "レバレッジ取引は極めて高いリスクがあり、全資金の損失につながる可能性があります。",
          "ユーザーは自身のリスク許容度に基づいて慎重に投資すべきです。本プラットフォームはいかなる投資損失についても責任を負いません。",
          "リスクを十分に理解した上で本プラットフォームのサービスをご利用ください。",
        ],
        accept: "読んで同意しました",
        warning: "リスク警告",
      },
      es: {
        title: "Descargo de Responsabilidad Importante",
        content: [
          "Todos los datos, predicciones y análisis proporcionados por esta plataforma son solo para referencia y no constituyen asesoramiento de inversión.",
          "Los mercados de criptomonedas son extremadamente riesgosos y volátiles, los precios pueden fluctuar significativamente.",
          "Las predicciones de IA se basan en datos históricos y modelos algorítmicos, no se puede garantizar la precisión.",
          "El trading con apalancamiento es extremadamente riesgoso y puede resultar en la pérdida total de fondos.",
          "Los usuarios deben invertir con precaución basándose en su propia tolerancia al riesgo. Esta plataforma no asume responsabilidad por pérdidas de inversión.",
          "Por favor use los servicios de esta plataforma con pleno entendimiento de los riesgos involucrados.",
        ],
        accept: "He leído y acepto",
        warning: "Advertencia de Riesgo",
      },
    }
    return disclaimers[lang] || disclaimers["zh-CN"]
  }

  const disclaimer = getDisclaimerText()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-black/90 border-red-500/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <CardHeader className="border-b border-red-500/30">
          <CardTitle className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="h-6 w-6" />
            {disclaimer.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-semibold">{disclaimer.warning}</span>
            </div>
            <ul className="space-y-3 text-gray-200 text-sm">
              {disclaimer.content.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={handleAccept} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3">
              {disclaimer.accept}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
