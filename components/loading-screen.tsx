"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1
        }
        clearInterval(interval)
        setFadeOut(true) // Start fade out
        return 100
      })
    }, 20) // Adjust speed as needed

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => {
        onComplete()
      }, 500) // Duration of fade-out animation
      return () => clearTimeout(timer)
    }
  }, [fadeOut, onComplete])

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } z-50`}
    >
      <div className="flex flex-col items-center justify-center flex-grow">
        <Image src="/v2-logo.png" alt="V2 Logo" width={120} height={120} className="animate-pulse" />
      </div>
      <div className="w-64 h-1 bg-gray-300 rounded-full overflow-hidden mb-10">
        <div className="h-full bg-gray-600 transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
