"use client"

import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function Filters() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search repositories or issues..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Language
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Languages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>JavaScript</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>TypeScript</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Python</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Rust</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Go</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Java</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Labels
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Labels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>good first issue</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>documentation</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>bug</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>enhancement</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>help wanted</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Newest</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Oldest</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Most commented</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Least commented</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Recently updated</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Least recently updated</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:items-start md:justify-between mx-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="unassigned" />
          <Label htmlFor="unassigned">Only issues without assignee</Label>
        </div>

        <div className="flex-1 space-y-1 md:max-w-md max-w-full w-64">
          <div className="flex justify-between">
            <Label>Repository Stars</Label>
            <span className="text-sm text-muted-foreground">1000+</span>
          </div>
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      </div>
    </div>
  )
}
