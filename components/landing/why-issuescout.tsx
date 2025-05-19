"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

const comparisonPoints = [
  {
    feature: "Modern UI Experience",
    issuescout: true,
    others: false,
  },
  {
    feature: "Issue Bookmarking",
    issuescout: true,
    others: false,
  },
  {
    feature: "Recently Viewed History",
    issuescout: true,
    others: false,
  },
  {
    feature: "GitHub Integration",
    issuescout: true,
    others: false,
  },
  {
    feature: "Personalized Dashboard",
    issuescout: true,
    others: false,
  },
  {
    feature: "Dark/Light Mode",
    issuescout: true,
    others: false,
  },
]

export function WhyIssueScout() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why IssueScout?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how IssueScout compares to other platforms for finding beginner-friendly issues.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden rounded-xl border bg-card shadow-sm"
        >
          <div className="grid grid-cols-3 text-center font-medium border-b">
            <div className="p-4 border-r">Feature</div>
            <div className="p-4 border-r bg-blue-50 dark:bg-blue-950/30">IssueScout</div>
            <div className="p-4 text-muted-foreground">Other Platforms</div>
          </div>

          {comparisonPoints.map((point, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 text-center ${index !== comparisonPoints.length - 1 ? "border-b" : ""}`}
            >
              <div className="p-4 border-r flex items-center justify-start pl-8">{point.feature}</div>
              <div className="p-4 border-r bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                {point.issuescout ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="p-4 flex items-center justify-center">
                {point.others ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
