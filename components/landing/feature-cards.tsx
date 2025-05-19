"use client"

import { motion } from "framer-motion"
import { Search, Bookmark, Clock, LayoutDashboard } from "lucide-react"

const features = [
  {
    title: "Clean, fast issue explorer",
    description: "Browse through thousands of beginner-friendly issues with our intuitive and responsive UI.",
    icon: Search,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Local + GitHub bookmarking",
    description: "Save interesting issues to your personal collection and sync them with your GitHub account.",
    icon: Bookmark,
    color: "from-amber-500 to-orange-400",
  },
  {
    title: "Recently viewed issue memory",
    description: "Keep track of issues you've explored, even if you didn't bookmark them yet.",
    icon: Clock,
    color: "from-green-500 to-emerald-400",
  },
  {
    title: "Profile dashboard with stats",
    description: "View your contribution journey with personalized statistics and progress tracking.",
    icon: LayoutDashboard,
    color: "from-purple-500 to-violet-400",
  },
]

export function FeatureCards() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Developers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to find and manage your first open source contributions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-xl blur-sm transition duration-300"></div>
              <div className="relative bg-card rounded-lg border p-6 h-full flex flex-col">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
