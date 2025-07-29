"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { motion } from "framer-motion"
import { CodeBlock } from "@/components/landing/code-block"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-50" />

      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/issuescout-PlcLPOydosymV3mviEASgLwNZgJDgO.png"
              alt="IssueScout Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Make Your First Open Source Contribution
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10"
          >
            IssueScout helps you explore curated &apos;Good First Issues&apos; with rich UI, bookmarking, and personalized GitHub
            syncing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
              onClick={() => window.open("https://issuescout.shashankxrm.me")}
            >
              Explore Issues
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all duration-300"
              onClick={() => window.open("https://github.com/shashankxrm/issuescout", "_blank")}
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative w-full max-w-4xl mx-auto"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-75"></div>
            <div className="relative bg-background rounded-lg border shadow-2xl overflow-hidden">
              <CodeBlock />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
