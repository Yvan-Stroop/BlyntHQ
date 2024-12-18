"use client"

import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBusinessForm() {
  const [businessName, setBusinessName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement business search
    console.log("Searching for:", businessName)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="business-name" className="sr-only">Business name</label>
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="business-name"
            type="text"
            placeholder="Enter business name..."
            className="pl-10"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Search Business
      </Button>
    </form>
  )
} 