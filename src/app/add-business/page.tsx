import { Metadata } from "next"
import { Suspense } from "react"
import { FormWrapper } from "./form-wrapper"
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BreadcrumbPath, BreadcrumbConfig } from '@/types/breadcrumb'

export const metadata: Metadata = {
  title: "Add Your Business - Blynt",
  description: "Add your business to Blynt. Get discovered by local customers and grow your business online.",
}

export default function AddBusinessPage() {
  const breadcrumbs: BreadcrumbConfig[] = [
    {
      type: 'navigation' as BreadcrumbPath,
      label: 'Add Business',
      href: '/add-business',
      description: 'Add your business to our directory'
    }
  ]

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Add Your Business</h1>
          <p className="text-muted-foreground">
            Get your business listed on Blynt. Fill out the form below with your business details.
            All submissions are reviewed for quality and accuracy.
          </p>
        </div>
        <Suspense fallback={<div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>}>
          <FormWrapper />
        </Suspense>
      </div>
    </div>
  )
} 