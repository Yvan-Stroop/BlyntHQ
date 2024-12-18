"use client"

import { useState } from "react"
import Link from "next/link"
import { IconMenu2, IconBuildingStore, IconCategory, IconMapPin, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import type { Category } from "@/lib/csv"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface HeaderProps {
  categories: Category[];
  states: {
    [key: string]: {
      name: string;
      cities: {
        [key: string]: {
          name: string;
        };
      };
    };
  };
}

export function Header({ categories, states }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get top states (most populated)
  const topStates = [
    { abbr: 'ca', name: 'California' },
    { abbr: 'fl', name: 'Florida' },
    { abbr: 'il', name: 'Illinois' },
    { abbr: 'va', name: 'Virginia' },
    { abbr: 'md', name: 'Maryland' },
    { abbr: 'nc', name: 'North Carolina' }
  ]

  // Get top categories (most searched)
  const topCategories = categories.slice(0, 8)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="border-b" aria-label="Main navigation">
        <div className="container flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Updated Logo and Homepage Link */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 shrink-0"
            aria-label="Blynt - Homepage"
          >
            <div className="relative h-6 w-20 sm:hidden">
              <Image
                src="/images/logo/blynt-logo-main.svg"
                alt="Blynt"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="relative hidden sm:block h-8 w-auto">
              <Image
                src="/images/logo/blynt-logo-main.svg"
                alt="Blynt"
                width={144}
                height={48}
                className="h-8 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <IconCategory className="h-4 w-4" aria-hidden="true" />
                  <span>Browse Categories</span>
                  <IconChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] p-2">
                {topCategories.map((category) => (
                  <DropdownMenuItem key={category.slug} asChild>
                    <Link 
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-2"
                      title={`Browse ${category.name} businesses`}
                    >
                      <IconCategory className="h-4 w-4" aria-hidden="true" />
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/categories"
                    className="flex items-center gap-2 border-t mt-2 pt-2"
                    title="View all business categories"
                  >
                    View all categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <IconMapPin className="h-4 w-4" aria-hidden="true" />
                  <span>Browse Locations</span>
                  <IconChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] p-2">
                {topStates.map((state) => (
                  <DropdownMenuItem key={state.abbr} asChild>
                    <Link 
                      href={`/locations/${state.abbr}`}
                      className="flex items-center gap-2"
                      title={`Browse businesses in ${state.name}`}
                    >
                      <IconMapPin className="h-4 w-4" aria-hidden="true" />
                      {state.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/locations"
                    className="flex items-center gap-2 border-t mt-2 pt-2"
                    title="View all business locations"
                  >
                    View all locations
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" asChild>
              <Link 
                href="/claim-business"
                title="Claim your business listing"
              >
                Claim Business
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link 
                href="/add-business"
                title="Add your business to our directory"
              >
                Add Business
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0 w-14 h-14 rounded-lg"
                aria-label="Open menu"
              >
                <IconMenu2 className="h-7 w-7" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-full sm:w-[300px]"
            >
              <nav className="grid gap-6 py-6" aria-label="Mobile navigation">
                <SheetTitle className="text-lg font-semibold">
                  Menu
                </SheetTitle>
                <div className="space-y-2">
                  <h2 className="font-medium text-sm">Categories</h2>
                  <div className="grid grid-cols-1 gap-2">
                    {topCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                        title={`Browse ${category.name} businesses`}
                      >
                        <IconCategory className="w-4 h-4" aria-hidden="true" />
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      href="/categories"
                      className="text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent text-primary"
                      onClick={() => setIsOpen(false)}
                      title="View all business categories"
                    >
                      View all categories
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-medium text-sm">Popular Locations</h2>
                  <div className="grid grid-cols-1 gap-2">
                    {topStates.map((state) => (
                      <Link
                        key={state.abbr}
                        href={`/locations/${state.abbr}`}
                        className="text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                        title={`Browse businesses in ${state.name}`}
                      >
                        <IconMapPin className="w-4 h-4" aria-hidden="true" />
                        {state.name}
                      </Link>
                    ))}
                    <Link
                      href="/locations"
                      className="text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent text-primary"
                      onClick={() => setIsOpen(false)}
                      title="View all business locations"
                    >
                      View all locations
                    </Link>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link 
                        href="/claim-business" 
                        onClick={() => setIsOpen(false)}
                        title="Claim your business listing"
                      >
                        Claim Business
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link 
                        href="/add-business" 
                        onClick={() => setIsOpen(false)}
                        title="Add your business to our directory"
                      >
                        Add Business
                      </Link>
                    </Button>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}