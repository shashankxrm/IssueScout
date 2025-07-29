import { FileSearch } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <FileSearch className="h-12 w-12 text-muted-foreground mb-4" data-testid="file-search-icon" />
        <h3 className="text-lg font-semibold">No issues found</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-2">
          Try adjusting your search or filter criteria to find what you&apos;re looking for.
        </p>
      </CardContent>
    </Card>
  )
}
