"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import DupliconAvatar from "@/components/ui/duplicon-avatar"

const testimonials = [
  {
    quote:
      "IssueScout helped me find my first open source issue and guided me through the contribution process. Highly recommended for beginners!",
    author: "Sarah Chen",
    role: "Frontend Developer",
  },
  {
    quote:
      "The cleanest open source issue tracker I've seen. The bookmarking feature is a game-changer for managing potential contributions.",
    author: "Michael Rodriguez",
    role: "Full Stack Developer",
  },
  {
    quote:
      "As a maintainer, I love that IssueScout helps direct new contributors to our good first issues. It's a win-win for everyone.",
    author: "Priya Sharma",
    role: "Open Source Maintainer",
  },
]

export function Testimonials() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Developers Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who&apos;ve found their first open source contributions with IssueScout.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full transition-all duration-300 group-hover:shadow-lg border-transparent group-hover:border-blue-500/20">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.667 18.667C10.667 21.244 8.577 23.334 6 23.334C3.423 23.334 1.333 21.244 1.333 18.667C1.333 16.09 3.423 14 6 14C6.423 14 6.833 14.056 7.223 14.156C7.19 13.767 7.167 13.389 7.167 13C7.167 7.11 12.11 2.167 18 2.167C23.89 2.167 28.833 7.11 28.833 13C28.833 18.89 23.89 23.834 18 23.834C17.611 23.834 17.233 23.811 16.844 23.778C16.944 24.167 17 24.577 17 25C17 27.577 14.91 29.667 12.333 29.667C9.756 29.667 7.667 27.577 7.667 25C7.667 22.423 9.756 20.334 12.333 20.334C12.756 20.334 13.167 20.389 13.556 20.489C13.523 20.1 13.5 19.722 13.5 19.334C13.5 13.444 18.444 8.5 24.333 8.5"
                        stroke="url(#paint0_linear_1_137)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_1_137"
                          x1="1.333"
                          y1="15.917"
                          x2="28.833"
                          y2="15.917"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-lg mb-6 flex-grow">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <DupliconAvatar seed={testimonial.author} size={40} />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
