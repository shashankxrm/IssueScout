"use client"

import { motion } from "framer-motion"
import { Github, Search, Bookmark } from "lucide-react"

const steps = [
  {
    title: "Sign in with GitHub",
    description: "Connect your GitHub account to personalize your experience and sync your bookmarks.",
    icon: Github,
    color: "bg-blue-500",
  },
  {
    title: "Explore beginner-friendly issues",
    description: "Browse through thousands of curated 'good first issues' from popular open source projects.",
    icon: Search,
    color: "bg-purple-500",
  },
  {
    title: "Bookmark and track issues",
    description: "Save interesting issues to your collection and track your contribution progress.",
    icon: Bookmark,
    color: "bg-amber-500",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your open source journey in three simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-8">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-foreground/20 to-transparent -translate-y-1/2"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
