"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IconMapPin, IconBuilding, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/csv"

export interface LocationSearchProps {
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
  categories: Category[];
}

export function LocationSearch({ states, categories }: LocationSearchProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [availableCities, setAvailableCities] = useState<{[key: string]: { name: string }}>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize component
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // Reset cities when state changes or component mounts
  useEffect(() => {
    if (!isInitialized) return;
    
    if (selectedState && states[selectedState]) {
      const cities = states[selectedState].cities || {}
      setAvailableCities(cities)
      if (selectedCity && !cities[selectedCity]) {
        setSelectedCity("")
      }
    } else {
      setAvailableCities({})
      setSelectedCity("")
    }
  }, [selectedState, states, isInitialized, selectedCity])

  // Reset state and city when category changes
  useEffect(() => {
    if (!isInitialized) return;
    
    setSelectedState("")
    setSelectedCity("")
    setAvailableCities({})
  }, [selectedCategory, isInitialized])

  const sortedCategories = [...categories].sort((a, b) => 
    a.name.localeCompare(b.name)
  )

  const sortedStates = Object.entries(states).sort(([, a], [, b]) => 
    a.name.localeCompare(b.name)
  )

  const sortedCities = Object.entries(availableCities)
    .sort(([, a], [, b]) => a.name.localeCompare(b.name))

  const handleSearch = () => {
    if (selectedCategory && selectedState && selectedCity) {
      router.push(`/categories/${selectedCategory}/${selectedState.toLowerCase()}/${selectedCity}`)
    }
  }

  if (!isInitialized) return null;

  return (
    <div className="space-y-6" key="location-search">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Category Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border-2 rounded-lg appearance-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-700"
            >
              <option value="">Select Category</option>
              {sortedCategories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <IconBuilding className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            <IconChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* State Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                setSelectedCity("") // Reset city when state changes
              }}
              className="w-full pl-10 pr-10 py-3 bg-white border-2 rounded-lg appearance-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-700"
            >
              <option value="">Select State</option>
              {sortedStates.map(([abbr, state]) => (
                <option key={abbr} value={abbr}>
                  {state.name}
                </option>
              ))}
            </select>
            <IconMapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            <IconChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* City Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState || Object.keys(availableCities).length === 0}
              className={`w-full pl-10 pr-10 py-3 bg-white border-2 rounded-lg appearance-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 
                ${!selectedState || Object.keys(availableCities).length === 0 ? 'cursor-not-allowed bg-gray-50' : ''}`}
            >
              <option value="">Select City</option>
              {sortedCities.map(([slug, city]) => (
                <option key={slug} value={slug}>
                  {city.name}
                </option>
              ))}
            </select>
            <IconMapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            <IconChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={!selectedState || !selectedCity || !selectedCategory}
        className="w-full py-3 px-6 rounded-lg font-bold transition-all"
      >
        Find Businesses
      </Button>
    </div>
  )
}