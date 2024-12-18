import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconHome, IconSearch, IconCategory, IconMapPin } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: '404: Page Not Found - Blynt',
  description: 'Sorry, we couldn\'t find the page you\'re looking for. It might have been moved, deleted, or never existed.',
  robots: {
    index: false,
    follow: true
  }
}

export default function NotFound(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Header */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Helpful Navigation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
              <IconHome className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Go Home</div>
                <div className="text-sm text-gray-500">Return to homepage</div>
              </div>
            </Button>
          </Link>

          <Link href="/categories" className="w-full">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
              <IconCategory className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Browse Categories</div>
                <div className="text-sm text-gray-500">Find businesses by category</div>
              </div>
            </Button>
          </Link>

          <Link href="/locations" className="w-full">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
              <IconMapPin className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Browse Locations</div>
                <div className="text-sm text-gray-500">Find businesses by location</div>
              </div>
            </Button>
          </Link>

          <Link href="/contact" className="w-full">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
              <IconSearch className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Need Help?</div>
                <div className="text-sm text-gray-500">Contact our support team</div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500 mt-8">
          If you believe this is a mistake or need assistance, please{' '}
          <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </main>
  )
} 