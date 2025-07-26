"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  isActive: boolean
  onComplete: () => void
  duration?: number
}

export function ProgressBar({ isActive, onComplete, duration = 8000 }: ProgressBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          onComplete()
          return 100
        }
        return prev + 0.5 // 从1改为0.5，让进度更慢更平滑
      })
    }, duration / 200) // 从100改为200，增加更新频率但减慢速度

    return () => clearInterval(interval)
  }, [isActive, onComplete, duration])

  if (!isActive) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">AI正在深度分析市场数据...</span>
        <span className="text-white font-medium">{progress.toFixed(1)}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-white/10" />
      <div className="text-xs text-gray-500 text-center">
        {progress < 20 && "正在获取实时价格数据..."}
        {progress >= 20 && progress < 40 && "分析技术指标和市场情绪..."}
        {progress >= 40 && progress < 60 && "计算支撑位和阻力位..."}
        {progress >= 60 && progress < 80 && "评估风险和机会..."}
        {progress >= 80 && progress < 95 && "生成预测结果..."}
        {progress >= 95 && "完成分析，准备展示..."}
      </div>
    </div>
  )
}
