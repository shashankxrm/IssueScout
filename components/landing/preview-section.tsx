"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function PreviewSection() {
  const { resolvedTheme } = useTheme()

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See IssueScout in Action</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A beautiful interface designed for developers, by developers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
          <div className="relative bg-background rounded-xl overflow-hidden shadow-2xl border">
            <div className="w-full h-8 bg-muted flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-full max-w-md mx-auto bg-background rounded-md h-5 flex items-center justify-center text-xs text-muted-foreground">
                issuescout.shashankxrm.me
              </div>
            </div>
            <div className="relative">
              <Image
                src={
                  resolvedTheme === "dark" ? "/issues-homepage-dark.png" : "/issues-homepage-light.png"
                }
                alt="IssueScout Dashboard Preview"
                width={1200}
                height={600}
                className="w-full h-auto"
                priority
              />
              <div className="absolute left-0 right-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
