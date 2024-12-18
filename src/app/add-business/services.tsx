"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IconPlus, IconX } from "@tabler/icons-react"

interface ServicesProps {
  services: string[]
  onChange: (services: string[]) => void
}

export function Services({ services, onChange }: ServicesProps) {
  const [newService, setNewService] = useState("")

  const addService = () => {
    if (newService.trim()) {
      onChange([...services, newService.trim()])
      setNewService("")
    }
  }

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addService()
    }
  }

  return (
    <div className="space-y-4">
      <Label>Services Offered</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add a service..."
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" onClick={addService} className="shrink-0">
          <IconPlus className="w-4 h-4" />
          <span className="sr-only">Add service</span>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
          >
            <span className="text-sm">{service}</span>
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-muted-foreground hover:text-foreground"
            >
              <IconX className="w-4 h-4" />
              <span className="sr-only">Remove {service}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 