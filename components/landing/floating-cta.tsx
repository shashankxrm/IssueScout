"use client"

import { useState, useEffect, ReactNode } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"

// Add keyframes for the pulse effect
const pulseAnimation = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.03, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut" 
    }
  }
}

interface FloatingCtaProps {
  /** The text to display next to the button (hidden on mobile) */
  text?: string
  /** The text for the button */
  buttonText: string
  /** The URL to navigate to when the button is clicked */
  buttonHref?: string
  /** When to show the CTA (scroll position in pixels) */
  showAfterScroll?: number
  /** Additional button props */
  buttonProps?: Omit<ButtonProps, 'children'>
  /** Optional custom button content */
  buttonContent?: ReactNode
}

export function FloatingCta({
  text = "Ready to explore open source issues?",
  buttonText = "Get Started",
  buttonHref = "/",
  showAfterScroll = 500,
  buttonProps,
  buttonContent,
}: FloatingCtaProps) {
  const [visible, setVisible] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > showAfterScroll) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showAfterScroll])

  const buttonElement = buttonContent || (
    <Button 
      size="sm" 
      variant={isDark ? "outline" : "default"}
      className={`rounded-full transition-all ${
        isDark 
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:from-blue-600 hover:to-purple-700 border-0" 
          : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700 border-0"
      }`}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  )

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-20 right-6 md:right-10 lg:right-16 z-50"
        >
          <motion.div 
            variants={pulseAnimation}
            initial="initial"
            animate="animate"
            className={`backdrop-blur-lg border shadow-xl ${
            isDark 
              ? "bg-gradient-to-r from-blue-950/60 to-purple-950/60 border-blue-500/30 text-white" 
              : "bg-gradient-to-r from-indigo-50/80 to-violet-50/80 border-indigo-300/40 text-gray-800"
          } rounded-full px-6 py-3 flex items-center gap-4 hover:shadow-lg transition-all duration-300`}
          >
            {text && <span className="text-sm font-medium hidden md:block">{text}</span>}
            {buttonHref ? (
              <Link href={buttonHref}>
                {buttonElement}
              </Link>
            ) : (
              buttonElement
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
