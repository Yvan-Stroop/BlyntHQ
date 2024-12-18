"use client"

import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BusinessHours } from "./business-hours"
import { Services } from "./services"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { generateUniqueSlug } from "@/lib/utils"
import { ProgressSteps } from "./progress-steps"

interface Category {
  name: string
  slug: string
}

interface FormData {
  // Basic Info
  businessName: string
  category: string
  website: string
  phone: string
  email: string

  // Location
  address: string
  city: string
  state: string
  zipCode: string
  serviceArea: string

  // Details
  description: string
  yearEstablished: string
  services: string[]
  workHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }

  // Contact
  contactName: string
  contactEmail: string
  contactPhone: string
  position: string
}

const INITIAL_FORM_DATA: FormData = {
  businessName: "",
  category: "",
  website: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  serviceArea: "",
  description: "",
  yearEstablished: "",
  services: [],
  workHours: {
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "17:00", closed: true },
    sunday: { open: "09:00", close: "17:00", closed: true },
  },
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  position: "",
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

interface AddBusinessFormProps {
  initialCategories: Category[]
}

const FORM_STEPS = [
  {
    title: "Basic Info",
    description: "Business details and contact"
  },
  {
    title: "Location",
    description: "Address and service area"
  },
  {
    title: "Details",
    description: "Hours and services"
  },
  {
    title: "Contact",
    description: "Contact person details"
  }
]

export function AddBusinessForm({ initialCategories }: AddBusinessFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.businessName &&
          formData.category &&
          formData.phone &&
          formData.email
        )
      case 2:
        return !!(
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode
        )
      case 3:
        return !!(formData.description)
      case 4:
        return !!(
          formData.contactName &&
          formData.contactEmail &&
          formData.contactPhone &&
          formData.position
        )
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      })
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(4)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      // Generate a unique slug for the business
      const slug = await generateUniqueSlug(
        formData.businessName, 
        formData.city,
        formData.address
      )

      // Convert form data to match the database schema
      const businessData = {
        title: formData.businessName,
        slug,
        category: formData.category,
        state: formData.state,
        city: formData.city,
        featured: false,
        status: 'draft' as const,
        address_info: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
          country_code: 'US',
          email: formData.email,
          phone: formData.phone,
          website: formData.website || null,
          contact: {
            name: formData.contactName,
            email: formData.contactEmail,
            phone: formData.contactPhone,
            position: formData.position
          }
        },
        work_hours: {
          timetable: Object.entries(formData.workHours).map(([day, hours]) => {
            if (hours.closed) return `${day}: Closed`
            return `${day}: ${hours.open} - ${hours.close}`
          })
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Insert the business into Supabase
      const { data, error } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message)
      }

      toast({
        title: "Success!",
        description: "Your business has been submitted and will be reviewed shortly.",
      })

      // Reset form
      setFormData(INITIAL_FORM_DATA)
      setCurrentStep(1)
    } catch (error) {
      console.error('Error submitting business:', error instanceof Error ? error.message : error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem submitting your business. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProgressSteps currentStep={currentStep - 1} steps={FORM_STEPS} />
      
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Business Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {initialCategories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Business Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleInputChange("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceArea">Service Area</Label>
            <Input
              id="serviceArea"
              value={formData.serviceArea}
              onChange={(e) => handleInputChange("serviceArea", e.target.value)}
              placeholder="e.g., Within 50 miles of location"
            />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Business Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Tell customers about your business..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearEstablished">Year Established</Label>
            <Input
              id="yearEstablished"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.yearEstablished}
              onChange={(e) => handleInputChange("yearEstablished", e.target.value)}
            />
          </div>

          <BusinessHours
            hours={formData.workHours}
            onChange={(hours) => handleInputChange("workHours", hours)}
          />

          <Services
            services={formData.services}
            onChange={(services) => handleInputChange("services", services)}
          />
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name *</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => handleInputChange("contactName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone *</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position/Role *</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => handleInputChange("position", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            Previous
          </Button>
        )}
        {currentStep < 4 ? (
          <Button type="button" onClick={nextStep} className="ml-auto">
            Next
          </Button>
        ) : (
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </form>
  )
} 