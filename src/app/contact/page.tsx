import { Metadata } from 'next'
import { 
  IconMail, 
  IconClock,
  IconInfoCircle
} from '@tabler/icons-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BreadcrumbPath, BreadcrumbConfig } from '@/types/breadcrumb'
import { SocialLinks } from '@/components/contact/social-links'
import { Suspense } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Contact Us - Blynt',
  description: 'Get in touch with Blynt. Report incorrect information, get help, or ask general questions about our business directory.',
  alternates: {
    canonical: 'https://getblynt.com/contact'
  }
}

export default function ContactPage() {
  const breadcrumbs: BreadcrumbConfig[] = [
    {
      type: 'navigation' as BreadcrumbPath,
      label: 'Contact',
      href: '/contact',
      description: 'Get in touch with us'
    }
  ]

  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="bg-white border-b">
          <div className="container py-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="container py-8">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-4">
              <div className="h-48 bg-gray-200 rounded mb-6"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <main>
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="container py-8 space-y-4">
            <Breadcrumbs items={breadcrumbs} className="mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have a question or found incorrect information? We're here to help you with any inquiries about our business directory.
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Contact Form */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <IconMail className="w-5 h-5 text-primary" />
                    Send us a Message
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <Separator />

                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incorrect">Report Incorrect Information</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea 
                      className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="space-y-6 pt-8">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <IconInfoCircle className="w-5 h-5 text-primary" />
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Quick answers to common questions about our service.
                  </p>
                </div>

                <Separator />

                <div className="space-y-8">
                  {/* General Questions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-muted-foreground">General Questions</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="font-medium">What is Blynt?</p>
                        <p className="text-sm text-muted-foreground">Blynt is a comprehensive business directory that helps users find and compare local businesses across the United States. We provide detailed information about businesses, including ratings, reviews, hours of operation, and contact details.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Is Blynt free to use?</p>
                        <p className="text-sm text-muted-foreground">Yes, Blynt is completely free for users to search and browse business listings.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">How often is the information updated?</p>
                        <p className="text-sm text-muted-foreground">We regularly update our business information to ensure accuracy. Updates can come from various sources including business owners, user reports, and our automated verification systems.</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Listings */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-muted-foreground">Business Listings</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="font-medium">How do I report incorrect business information?</p>
                        <p className="text-sm text-muted-foreground">You can report incorrect information using our contact form above. Select "Report Incorrect Information" as the subject and provide details about the inaccuracy.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Why are some business hours listed as "Hours Not Available"?</p>
                        <p className="text-sm text-muted-foreground">This happens when we haven't yet verified the business's operating hours or when hours vary by season or special circumstances.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">How are businesses ranked in search results?</p>
                        <p className="text-sm text-muted-foreground">Businesses are ranked based on multiple factors including rating, number of reviews, distance from search location, and completeness of business information.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">What does "Verified Business" mean?</p>
                        <p className="text-sm text-muted-foreground">A verified business has confirmed their listing information and has provided documentation to prove their business ownership and operations.</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Support */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-muted-foreground">Technical Support</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="font-medium">Why isn't the map loading for a business?</p>
                        <p className="text-sm text-muted-foreground">This might happen if the business's address isn't properly geocoded or if there are temporary issues with the map service. Try refreshing the page or using a different browser.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">How do I clear my search history?</p>
                        <p className="text-sm text-muted-foreground">Your search history is stored locally in your browser. You can clear it by clearing your browser's cookies and site data.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">The website isn't loading properly. What should I do?</p>
                        <p className="text-sm text-muted-foreground">Try clearing your browser cache, updating your browser, or disabling extensions. If problems persist, contact our technical support.</p>
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Data */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-muted-foreground">Privacy & Data</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="font-medium">How is my contact information used?</p>
                        <p className="text-sm text-muted-foreground">Your contact information is only used to respond to your inquiries and is never shared with third parties. Read our Privacy Policy for more details.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Do you store my search history?</p>
                        <p className="text-sm text-muted-foreground">We only store anonymous usage statistics to improve our service. Personal search history is stored locally in your browser and can be cleared at any time.</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">What data do you collect about businesses?</p>
                        <p className="text-sm text-muted-foreground">We collect publicly available business information including names, addresses, phone numbers, websites, hours of operation, and user-submitted reviews and ratings.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-8"></div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Contact Info */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <Separator />
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <IconMail className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <p className="text-muted-foreground">support@blynt.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <IconClock className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Support Hours</p>
                        <p className="text-muted-foreground">Monday - Friday</p>
                        <p className="text-muted-foreground">9:00 AM - 5:00 PM EST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Connect With Us</h3>
                  <Separator />
                  <SocialLinks />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  )
} 