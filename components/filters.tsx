"use client"

import { useState, useEffect } from 'react';
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
import { GitHubService } from '@/lib/github';

interface FiltersProps {
  onLanguageChange: (languages: string[]) => void;
  selectedLanguages: string[];
  onLabelChange: (labels: string[]) => void;
  selectedLabels: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sort: 'created' | 'updated' | 'comments';
  onSortChange: (sort: 'created' | 'updated' | 'comments') => void;
  order: 'asc' | 'desc';
  onOrderChange: (order: 'asc' | 'desc') => void;
  minStars: number;
  onMinStarsChange: (stars: number) => void;
  noAssignee: boolean;
  onNoAssigneeChange: (value: boolean) => void;
}

export function Filters({ 
  onLanguageChange, 
  selectedLanguages,
  onLabelChange,
  selectedLabels,
  searchQuery,
  onSearchChange,
  sort,
  onSortChange,
  order,
  onOrderChange,
  minStars,
  onMinStarsChange,
  noAssignee,
  onNoAssigneeChange,
}: FiltersProps) {
  const [languages, setLanguages] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const popularLanguages = GitHubService.getPopularLanguages();
      const popularLabels = GitHubService.getPopularLabels();
      setLanguages(popularLanguages);
      setLabels(popularLabels);
    } catch (error) {
      console.error('Error loading filters:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      onLanguageChange([...selectedLanguages, language]);
    } else {
      onLanguageChange(selectedLanguages.filter(lang => lang !== language));
    }
  };

  const handleLabelChange = (label: string, checked: boolean) => {
    if (checked) {
      onLabelChange([...selectedLabels, label]);
    } else {
      onLabelChange(selectedLabels.filter(l => l !== label));
    }
  };

  const handleSortChange = (newSort: 'created' | 'updated' | 'comments') => {
    if (newSort === sort) {
      // Toggle order if clicking the same sort option
      onOrderChange(order === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort and default to descending order
      onSortChange(newSort);
      onOrderChange('desc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search repositories or issues..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Language
                <ChevronDown className="h-4 w-4" />
                {selectedLanguages.length > 0 && (
                  <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {selectedLanguages.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Languages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((language) => (
                <DropdownMenuCheckboxItem
                  key={language}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageChange(language, checked)}
                >
                  {language}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Labels
                <ChevronDown className="h-4 w-4" />
                {selectedLabels.length > 0 && (
                  <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {selectedLabels.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Labels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {labels.map((label) => (
                <DropdownMenuCheckboxItem
                  key={label}
                  checked={selectedLabels.includes(label)}
                  onCheckedChange={(checked) => handleLabelChange(label, checked)}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
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
              <DropdownMenuCheckboxItem 
                checked={sort === 'created'} 
                onCheckedChange={() => handleSortChange('created')}
              >
                Newest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sort === 'created' && order === 'asc'} 
                onCheckedChange={() => handleSortChange('created')}
              >
                Oldest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sort === 'comments'} 
                onCheckedChange={() => handleSortChange('comments')}
              >
                Most commented
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sort === 'comments' && order === 'asc'} 
                onCheckedChange={() => handleSortChange('comments')}
              >
                Least commented
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sort === 'updated'} 
                onCheckedChange={() => handleSortChange('updated')}
              >
                Recently updated
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sort === 'updated' && order === 'asc'} 
                onCheckedChange={() => handleSortChange('updated')}
              >
                Least recently updated
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:items-start md:justify-between mx-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="unassigned" 
            checked={noAssignee}
            onCheckedChange={(checked) => onNoAssigneeChange(checked as boolean)}
          />
          <Label htmlFor="unassigned">Only issues without assignee</Label>
        </div>

        <div className="flex-1 space-y-1 md:max-w-md max-w-full w-64">
          <div className="flex justify-between">
            <Label>Repository Stars</Label>
            <span className="text-sm text-muted-foreground">{minStars > 0 ? `${minStars}+` : 'Any'}</span>
          </div>
          <Slider 
            defaultValue={[0]} 
            max={1000} 
            step={100} 
            value={[minStars]}
            onValueChange={([value]) => onMinStarsChange(value)}
          />
        </div>
      </div>
    </div>
  )
}
