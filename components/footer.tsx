"use client"
import { Github, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex md:flex-row flex-col items-center justify-between gap-4 md:h-16">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} IssueScout. All rights reserved.
        </p>
        <div className="flex flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 w-full sm:w-auto" onClick={() => window.open('https://github.com/shashankxrm/issuescout', '_blank')}>
            <Github className="h-4 w-4" />
            <span>Contribute</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1 w-full sm:w-auto" onClick={() => window.open('https://www.buymeacoffee.com/shashankxrm', '_blank')}>
            <Coffee className="h-4 w-4" />
            <span>Buy me a coffee</span>
          </Button>
        </div>
      </div>
    </footer>
  )
}