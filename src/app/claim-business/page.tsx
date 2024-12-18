import { Metadata } from "next"
import { SearchBusinessForm } from "./search-form"
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BreadcrumbPath, BreadcrumbConfig } from '@/types/breadcrumb'

export const metadata: Metadata = {
  title: "Claim Your Business - Blynt",
  description: "Claim and verify your business listing on Blynt. Take control of your business information and connect with more customers.",
}

export default function ClaimBusinessPage() {
  const breadcrumbs: BreadcrumbConfig[] = [
    {
      type: 'navigation' as BreadcrumbPath,
      label: 'Claim Business',
      href: '/claim-business',
      description: 'Claim and verify your business'
    }
  ]

  return (
    <main className="container py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbs} className="mb-8" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Claim Your Business
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Take control of your business listing and reach more customers
        </p>
      </div>

      {/* Search Business Section */}
      <div className="max-w-xl mx-auto mb-16">
        <div className="bg-muted/30 border rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Find Your Business</h2>
          <p className="text-muted-foreground mb-6">
            Search for your business name and location to get started
          </p>
          <SearchBusinessForm />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-8">
          Why Claim Your Business?
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg bg-card">
            <div className="w-8 h-8 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Verify Ownership</h3>
            <p className="text-sm text-muted-foreground">
              Show customers that you're the verified owner and build trust
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="w-8 h-8 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Update Information</h3>
            <p className="text-sm text-muted-foreground">
              Keep your business hours, contact info, and details up to date
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="w-8 h-8 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Connect with Customers</h3>
            <p className="text-sm text-muted-foreground">
              Respond to reviews and engage with your customers directly
            </p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="max-w-xl mx-auto mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Can't find your business? {" "}
          <a href="/add-business" className="text-primary hover:underline">
            Add your business listing
          </a>
        </p>
      </div>
    </main>
  )
} 