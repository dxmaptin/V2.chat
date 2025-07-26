"use client"

import { useState, useEffect } from "react"

interface CircularProgressProps {
  isActive: boolean
  onComplete: () => void
  duration?: number
  size?: number
  strokeWidth?: number
  title?: string
  subtitle?: string
}

export function CircularProgress({
  isActive,
  onComplete,
  duration = 8000, // 从5000ms增加到8000ms，更慢
  size = 120,
  strokeWidth = 8,
  title = "AI分析中",
  subtitle = "请稍候...",
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = ["初始化分析引擎", "获取市场数据", "技术指标计算", "情绪分析处理", "风险评估建模", "生成分析报告"]

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      setCurrentStep(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.25 // 从0.5改为0.25，更慢的进度增长

        // 更新步骤
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        setCurrentStep(Math.min(stepIndex, steps.length - 1))

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500) // 增加延迟让动画更自然
          return 100
        }
        return newProgress
      })
    }, duration / 400) // 从200改为400，更频繁的更新但更慢的速度

    return () => clearInterval(interval)
  }, [isActive, onComplete, duration])

  if (!isActive) return null

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      {/* 圆形进度条 */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* 背景圆环 */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* 进度圆环 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out" // 增加过渡时间
          />
          {/* 渐变定义 - 更美观的颜色 */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="30%" stopColor="#06B6D4" />
              <stop offset="60%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        {/* 中心内容 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-white mb-1">{Math.round(progress)}%</div>
          <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 rounded-full transition-all duration-700" // 增加过渡时间
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 脉冲效果 - 更美观的颜色 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-amber-400/10 animate-pulse" />
      </div>

      {/* 标题和步骤 */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">{subtitle}</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-xs text-emerald-400 font-medium">{steps[currentStep]}</p>
          </div>
        </div>
      </div>

      {/* 步骤指示器 - 更美观的颜色 */}
      <div className="flex items-center gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-700 ${
              index <= currentStep
                ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 scale-110 shadow-lg"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
