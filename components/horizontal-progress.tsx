"use client"

import { useState, useEffect } from "react"

interface HorizontalProgressProps {
  isActive: boolean
  onComplete: () => void
  duration?: number
  title?: string
  subtitle?: string
}

export function HorizontalProgress({
  isActive,
  onComplete,
  duration = 8000,
  title = "AI分析中",
  subtitle = "请稍候...",
}: HorizontalProgressProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = ["初始化V2 AI引擎", "分析市场数据", "计算风险参数", "生成交易策略", "优化杠杆配置", "完成策略分析"]

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      setCurrentStep(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.5 // 每次增加0.5%

        // 更新步骤
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        setCurrentStep(Math.min(stepIndex, steps.length - 1))

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500) // 延迟500ms完成
          return 100
        }
        return newProgress
      })
    }, duration / 200) // 调整更新频率

    return () => clearInterval(interval)
  }, [isActive, onComplete, duration])

  if (!isActive) return null

  return (
    <div className="space-y-6 py-8">
      {/* 标题和当前步骤 */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>

        {/* 当前步骤指示 */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-blue-600 font-medium">{steps[currentStep]}</p>
        </div>
      </div>

      {/* 横向进度条 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">分析进度</span>
          <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
        </div>

        {/* 进度条容器 */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* 进度条填充 */}
          <div
            className="h-full bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* 光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-between">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index <= currentStep ? "bg-gray-600 scale-110 shadow-md" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">正在使用V2 AI进行深度分析...</p>
      </div>
    </div>
  )
}
