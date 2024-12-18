"use client"

import { BusinessHours } from "@/types/dataforseo"

export function formatPhoneNumber(phone: string | null): string | null {
  if (!phone) return null
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function getOpenStatus(hours: BusinessHours | null): boolean {
  if (!hours || !hours.timetable) return false

  // Use UTC to avoid timezone issues
  const now = new Date()
  const day = now.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toLowerCase()
  const currentHour = now.getUTCHours()
  const currentMinute = now.getUTCMinutes()

  const todayHours = hours.timetable[day]
  if (!todayHours) return false

  return todayHours.some(({ open, close }) => {
    const openTime = open.hour * 60 + open.minute
    const closeTime = close.hour * 60 + close.minute
    const currentTime = currentHour * 60 + currentMinute
    return currentTime >= openTime && currentTime <= closeTime
  })
}

export function formatBusinessHours(hours: BusinessHours | null): string {
  if (!hours || !hours.timetable) return "Hours not available"

  const now = new Date()
  const today = now.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toLowerCase()
  const todayHours = hours.timetable[today]

  if (!todayHours) return "Closed today"

  return todayHours.map(({ open, close }) => (
    `${formatTime(open)} - ${formatTime(close)}`
  )).join(", ")
}

function formatTime({ hour, minute }: { hour: number, minute: number }): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
} 