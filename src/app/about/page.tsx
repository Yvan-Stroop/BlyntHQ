import { Metadata } from 'next'
import { 
  IconBuildingStore,
  IconUsers,
  IconSearch,
  IconMap,
  IconStarFilled,
  IconTrendingUp,
  IconDevices,
  IconShield,
  IconChartBar,
  IconBuildingCommunity,
  IconChecks
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BreadcrumbPath, BreadcrumbConfig } from '@/types/breadcrumb'

export const metadata: Metadata = {
  title: 'About Us - Blynt',
  description: 'Learn about Blynt - your comprehensive local business directory helping users find and compare businesses across the United States.',
  alternates: {
    canonical: 'https://getblynt.com/about'
  }
}

export default function AboutPage() {
  const breadcrumbs: BreadcrumbConfig[] = [
    {
      type: 'navigation' as BreadcrumbPath,
      label: 'About',
      href: '/about',
      description: 'Learn about Blynt'
    }
  ]

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="container py-12 md:py-16">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Connecting People with Local Businesses
            </h1>
            <p className="text-xl text-muted-foreground">
              Blynt is your comprehensive local business directory, helping millions discover 
              and connect with businesses across the United States.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b bg-white">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Business Listings</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">5M+</div>
              <div className="text-sm text-muted-foreground">Monthly Users</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Mission Section */}
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Making it easier for people to find and connect with the right local businesses.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <IconSearch className="w-8 h-8 text-primary" />
                <h3 className="font-semibold">Easy Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced search and filtering to help users find exactly what they're looking for.
                </p>
              </Card>
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <IconChecks className="w-8 h-8 text-primary" />
                <h3 className="font-semibold">Verified Information</h3>
                <p className="text-sm text-muted-foreground">
                  Regularly updated and verified business details you can trust.
                </p>
              </Card>
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <IconBuildingCommunity className="w-8 h-8 text-primary" />
                <h3 className="font-semibold">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by user feedback and local business participation.
                </p>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">What Sets Us Apart</h2>
              <Separator />
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <IconMap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Comprehensive Coverage</h3>
                      <p className="text-sm text-muted-foreground">
                        Extensive database covering all US states and territories with detailed business information.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <IconStarFilled className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Quality Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified business information with regular updates and quality checks.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <IconChartBar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Smart Rankings</h3>
                      <p className="text-sm text-muted-foreground">
                        Intelligent sorting based on multiple factors including ratings, reviews, and relevance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <IconDevices className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Mobile Optimized</h3>
                      <p className="text-sm text-muted-foreground">
                        Seamless experience across all devices with responsive design.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <IconShield className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Privacy First</h3>
                      <p className="text-sm text-muted-foreground">
                        Strong commitment to user privacy and data protection.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <IconTrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Always Improving</h3>
                      <p className="text-sm text-muted-foreground">
                        Continuous updates and improvements based on user feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Our Community</h2>
              <Separator />
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 space-y-6">
              <div className="flex justify-center">
                <IconUsers className="w-12 h-12 text-primary" />
              </div>
              <div className="prose prose-sm max-w-none text-center">
                <p>
                  Blynt is more than just a directory - we're a community platform 
                  that connects businesses with potential customers. We work closely with business 
                  owners to ensure their information is accurate and up-to-date, while providing 
                  users with the tools they need to make informed decisions.
                </p>
                <p>
                  Our platform serves millions of users across the United States, helping them 
                  discover and connect with local businesses in their area. Whether you're looking 
                  for a specific service or exploring what's available in your neighborhood, 
                  Blynt is here to help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 