import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BreadcrumbPath, BreadcrumbConfig } from '@/types/breadcrumb'

export const metadata: Metadata = {
  title: 'Privacy Policy - Blynt',
  description: 'Learn about how we collect, use, and protect your personal information at Blynt.',
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://getblynt.com/privacy'
  }
}

export default function PrivacyPage() {
  const breadcrumbs: BreadcrumbConfig[] = [
    {
      type: 'navigation' as BreadcrumbPath,
      label: 'Privacy Policy',
      href: '/privacy',
      description: 'Our privacy policy and data practices'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <article className="max-w-4xl mx-auto mt-8 md:mt-12">
            <Breadcrumbs items={breadcrumbs} className="mb-8" />
            <header className="space-y-4 text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </header>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-card rounded-lg border p-6 md:p-8 mb-8">
                <p className="lead">
                  At Blynt, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. 
                  If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </div>

              <section className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Information We Collect</h2>
                  
                  <div className="pl-4 border-l-2 border-primary/20">
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <p>
                      We may collect personal information that you voluntarily provide to us when you:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Use our search functionality</li>
                      <li>Sign up for our newsletter</li>
                      <li>Contact us through our website</li>
                      <li>Submit business information</li>
                    </ul>
                    
                    <p className="mt-4">This information may include:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Name and contact information</li>
                      <li>Email address</li>
                      <li>Location data</li>
                      <li>Business-related information</li>
                    </ul>
                  </div>

                  <div className="pl-4 border-l-2 border-primary/20">
                    <h3 className="text-xl font-semibold mb-4">Automatically Collected Information</h3>
                    <p>
                      When you visit our website, we automatically collect certain information about your device, including:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>IP address</li>
                      <li>Browser type</li>
                      <li>Operating system</li>
                      <li>Access times</li>
                      <li>Pages viewed</li>
                      <li>Search queries</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">How We Use Your Information</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Provide and maintain our services</li>
                      <li>Improve user experience</li>
                      <li>Analyze website usage</li>
                      <li>Send newsletters and updates (with your consent)</li>
                      <li>Respond to user inquiries</li>
                      <li>Protect against unauthorized access</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Information Sharing and Disclosure</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Service providers who assist in our operations</li>
                      <li>Law enforcement when required by law</li>
                      <li>Third parties with your explicit consent</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Cookies and Tracking Technologies</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                      Cookies are files with small amount of data which may include an anonymous unique identifier. 
                      You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Data Security</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      We implement appropriate technical and organizational security measures to protect your information. 
                      However, no method of transmission over the Internet or electronic storage is 100% secure, 
                      and we cannot guarantee absolute security.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Your Privacy Rights</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Request deletion of your information</li>
                      <li>Object to processing of your information</li>
                      <li>Withdraw consent</li>
                      <li>Data portability</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Children's Privacy</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
                      information from children under 13. If you are under 13, please do not provide any information on this website.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Third-Party Links</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      Our website may contain links to third-party websites. We are not responsible for the privacy practices 
                      or content of these third-party sites. We encourage you to read the privacy policy of every website you visit.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Changes to This Privacy Policy</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                      Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
                      Policy periodically for any changes.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">Contact Us</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Email: privacy@getblynt.com</li>
                      <li>Address: [Your Business Address]</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">California Privacy Rights</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), 
                      including the right to know what personal information we collect, the right to delete your personal information, 
                      and the right to opt-out of the sale of your personal information.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">International Users</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      Our website is operated in the United States. If you are accessing our website from outside the United States, 
                      please be aware that your information may be transferred to, stored, and processed in the United States. 
                      By using our website, you consent to this transfer.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
} 