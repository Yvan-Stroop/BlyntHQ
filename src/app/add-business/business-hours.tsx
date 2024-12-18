"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface BusinessHoursProps {
  hours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  onChange: (hours: BusinessHoursProps["hours"]) => void
}

const DAYS = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

export function BusinessHours({ hours, onChange }: BusinessHoursProps) {
  const handleTimeChange = (day: string, type: "open" | "close", value: string) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        [type]: value,
      },
    })
  }

  const handleClosedChange = (day: string, closed: boolean) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        closed,
      },
    })
  }

  return (
    <div className="space-y-4">
      <Label>Business Hours</Label>
      <div className="space-y-4">
        {DAYS.map((day) => (
          <div key={day.id} className="flex items-center gap-4">
            <div className="w-28">
              <Label>{day.label}</Label>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={!hours[day.id].closed}
                onCheckedChange={(checked) => handleClosedChange(day.id, !checked)}
              />
              {!hours[day.id].closed && (
                <>
                  <Input
                    type="time"
                    value={hours[day.id].open}
                    onChange={(e) => handleTimeChange(day.id, "open", e.target.value)}
                    className="w-32"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={hours[day.id].close}
                    onChange={(e) => handleTimeChange(day.id, "close", e.target.value)}
                    className="w-32"
                  />
                </>
              )}
              {hours[day.id].closed && (
                <span className="text-sm text-muted-foreground">Closed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 