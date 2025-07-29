"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Define syntax highlighting colors
const syntaxColors: Record<string, string> = {
    keyword: "text-purple-400",
    function: "text-blue-400",
    string: "text-green-400",
    comment: "text-gray-500",
    variable: "text-amber-300",
    property: "text-cyan-300",
    operator: "text-pink-400",
    number: "text-orange-400",
  }
  
  // Code snippet with syntax highlighting tokens
  const codeSnippet = [
    { type: "comment", text: "// Find your first open source issue" },
    { type: "keyword", text: "const " },
    { type: "variable", text: "issueScout" },
    { type: "operator", text: " = {" },
    { type: "newline" },
    { type: "function", text: "  findIssues" },
    { type: "operator", text: ": " },
    { type: "keyword", text: "async " },
    { type: "operator", text: "(" },
    { type: "variable", text: "options" },
    { type: "operator", text: ") => {" },
    { type: "newline" },
    { type: "keyword", text: "    const " },
    { type: "operator", text: "{" },
    { type: "property", text: " language, labels, experience " },
    { type: "operator", text: "}" },
    { type: "operator", text: " = " },
    { type: "variable", text: "options" },
    { type: "operator", text: ";" },
    { type: "newline" },
    { type: "newline" },
    { type: "comment", text: "    // Search for beginner-friendly issues" },
    { type: "newline" },
    { type: "keyword", text: "    const " },
    { type: "variable", text: "issues" },
    { type: "operator", text: " = " },
    { type: "keyword", text: "await " },
    { type: "variable", text: "github" },
    { type: "property", text: ".search" },
    { type: "property", text: ".issues" },
    { type: "operator", text: "({" },
    { type: "newline" },
    { type: "property", text: "      q" },
    { type: "operator", text: ": " },
    { type: "string", text: '`is:issue is:open label:"good first issue" language:${' },
    { type: "variable", text: "language" },
    { type: "string", text: "}`" },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "      sort" },
    { type: "operator", text: ": " },
    { type: "string", text: '"created"' },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "      order" },
    { type: "operator", text: ": " },
    { type: "string", text: '"desc"' },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "      per_page" },
    { type: "operator", text: ": " },
    { type: "number", text: "10" },
    { type: "newline" },
    { type: "operator", text: "    });" },
    { type: "newline" },
    { type: "newline" },
    { type: "keyword", text: "    return " },
    { type: "variable", text: "issues" },
    { type: "property", text: ".map" },
    { type: "operator", text: "(" },
    { type: "variable", text: "issue" },
    { type: "operator", text: " => ({" },
    { type: "newline" },
    { type: "property", text: "      title" },
    { type: "operator", text: ": " },
    { type: "variable", text: "issue" },
    { type: "property", text: ".title" },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "      repo" },
    { type: "operator", text: ": " },
    { type: "variable", text: "issue" },
    { type: "property", text: ".repository" },
    { type: "property", text: ".full_name" },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "      url" },
    { type: "operator", text: ": " },
    { type: "variable", text: "issue" },
    { type: "property", text: ".html_url" },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "      language" },
    { type: "operator", text: ": " },
    { type: "variable", text: "issue" },
    { type: "property", text: ".repository" },
    { type: "property", text: ".language" },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "      stars" },
    { type: "operator", text: ": " },
    { type: "variable", text: "issue" },
    { type: "property", text: ".repository" },
    { type: "property", text: ".stargazers_count" },
    { type: "newline" },
    { type: "operator", text: "    }));" },
    { type: "newline" },
    { type: "operator", text: "  }," },
    { type: "newline" },
    { type: "newline" },
    { type: "function", text: "  bookmarkIssue" },
    { type: "operator", text: ": (" },
    { type: "variable", text: "issue" },
    { type: "operator", text: ") => {" },
    { type: "newline" },
    { type: "comment", text: "    // Save to your bookmarks" },
    { type: "newline" },
    { type: "keyword", text: "    return " },
    { type: "variable", text: "issueScout" },
    { type: "property", text: ".bookmarks" },
    { type: "property", text: ".add" },
    { type: "operator", text: "(" },
    { type: "variable", text: "issue" },
    { type: "operator", text: ");" },
    { type: "newline" },
    { type: "operator", text: "  }" },
    { type: "newline" },
    { type: "operator", text: "};" },
    { type: "newline" },
    { type: "newline" },
    { type: "comment", text: "// Start your open source journey today!" },
    { type: "newline" },
    { type: "keyword", text: "const " },
    { type: "variable", text: "myFirstIssue" },
    { type: "operator", text: " = " },
    { type: "keyword", text: "await " },
    { type: "variable", text: "issueScout" },
    { type: "property", text: ".findIssues" },
    { type: "operator", text: "({" },
    { type: "newline" },
    { type: "property", text: "  language" },
    { type: "operator", text: ": " },
    { type: "string", text: '"javascript"' },
    { type: "operator", text: "," },
    { type: "newline" },
    { type: "property", text: "  labels" },
    { type: "operator", text: ": [" },
    { type: "string", text: '"good first issue"' },
    { type: "operator", text: ", " },
    { type: "string", text: '"help wanted"' },
    { type: "operator", text: "]," },
    { type: "newline" },
    { type: "property", text: "  experience" },
    { type: "operator", text: ": " },
    { type: "string", text: '"beginner"' },
    { type: "newline" },
    { type: "operator", text: "});" },
  ]
  
  export function CodeBlock() {
    const [displayedCodeIndex, setDisplayedCodeIndex] = useState(0)
    const [isTypingComplete, setIsTypingComplete] = useState(false)
  
    useEffect(() => {
      if (displayedCodeIndex < codeSnippet.length) {
        const timeout = setTimeout(() => {
          setDisplayedCodeIndex((prev) => prev + 1)
        }, 20) // Fast typing speed
  
        return () => clearTimeout(timeout)
      } else {
        setIsTypingComplete(true)
      }
    }, [displayedCodeIndex])
  
    // Function to render code with syntax highlighting
    const renderCode = () => {
      return codeSnippet.slice(0, displayedCodeIndex).map((token, index) => {
        if (token.type === "newline") {
          return <br key={index} />
        }
  
        return (
          <span key={index} className={token.type !== "text" ? syntaxColors[token.type] : ""}>
            {token.text}
          </span>
        )
      })
    }
  
    // Random floating particles effect
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  
    return (
      <div className="relative p-4 md:p-6 bg-[#0d1117] text-white font-mono text-sm md:text-base overflow-x-auto rounded-lg">
        {/* Floating particles */}
        {isTypingComplete &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-blue-500/20"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: particle.delay,
              }}
            />
          ))}
  
        {/* Code editor top bar */}
        <div className="flex items-center mb-3 text-xs text-gray-400">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center">issuescout.js</div>
        </div>
  
        {/* Line numbers and code */}
        <div className="flex">
          <div className="pr-4 text-gray-500 select-none border-r border-gray-700 mr-4">
            {Array.from({ length: codeSnippet.filter((token) => token.type === "newline").length + 1 }).map((_, i) => (
              <div key={i} className="h-6">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="flex-1">
            <code>{renderCode()}</code>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
              className="inline-block w-2 h-5 bg-blue-500 ml-0.5"
            />
          </pre>
        </div>
      </div>
    )
  }
  