import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination() {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button variant="outline" size="icon" disabled>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-current="page">
        1
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        2
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        3
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        4
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        5
      </Button>
      <Button variant="outline" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
