"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function FinalCta() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]"></div>

          <div className="relative px-6 py-16 md:px-12 md:py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Contribute Smarter?</h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10">
              Join thousands of developers who are making their first open source contributions with IssueScout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-6 rounded-lg shadow-lg hover:-translate-y-1 transition-all duration-300"
                onClick={() => window.open("https://issuescout.shashankxrm.me")}
              >
                Find Your First Issue
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-black dark:text-white border-blue-600 dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-lg px-8 py-6 rounded-lg flex items-center gap-2 hover:-translate-y-1 transition-all duration-300"
                onClick={() => window.open("https://github.com/shashankxrm/issuescout", "_blank")}
              >
                <Github className="w-5 h-5" />
                Star on GitHub
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
