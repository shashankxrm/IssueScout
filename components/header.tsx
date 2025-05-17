"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Github, LayoutDashboard, PlusCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useTheme } from "next-themes"

export default function Header() {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"
  const { isAuthenticated, login } = useAuth()
  const { resolvedTheme } = useTheme()
  
  const logoSrc = resolvedTheme === 'dark' 
    ? '/issuescout-dark.png' 
    : '/issuescout-light.png'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8">
            <Image
              src={logoSrc}
              alt="IssueScout Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-semibold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            IssueScout
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
            {isDashboard ? (
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden md:block">Issues</span>
              </Button>
            </Link>
            ) : (
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-1">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:block">Dashboard</span>
              </Button>
            </Link>
            )}
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={login}
            >
              <Github className="h-4 w-4" />
              <span>Sign in</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
