import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BreadcrumbPath, BreadcrumbConfig } from '@/types/breadcrumb'

export const metadata: Metadata = {
  title: 'Terms of Service - Blynt',
  description: 'Read our terms of service to understand the rules, guidelines, and agreements for using Blynt.',
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://getblynt.com/terms'
  }
}

export default function TermsPage() {
  const breadcrumbs: BreadcrumbConfig[] = [
    {
      type: 'navigation' as BreadcrumbPath,
      label: 'Terms of Service',
      href: '/terms',
      description: 'Our terms of service and usage guidelines'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <article className="max-w-4xl mx-auto mt-8 md:mt-12">
            <Breadcrumbs items={breadcrumbs} className="mb-8" />
            <header className="space-y-4 text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </header>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-card rounded-lg border p-6 md:p-8 mb-8">
                <p className="lead">
                  Welcome to Blynt. By accessing or using our website, you agree to be bound by these Terms of Service. 
                  Please read these terms carefully before using our services. If you do not agree with any part of these terms, 
                  you may not access or use our website.
                </p>
              </div>

              <section className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">1. Acceptance of Terms</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      By accessing or using Blynt, you acknowledge that you have read, understood, and agree to be 
                      bound by these Terms of Service. These terms may be updated from time to time without notice, and your 
                      continued use of the website constitutes acceptance of any changes.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">2. Description of Service</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      Blynt is a business directory and information service that provides users with access to 
                      business listings, contact information, and related content. We strive to maintain accurate and up-to-date 
                      information, but we cannot guarantee the accuracy, completeness, or reliability of any information on the website.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">3. User Conduct</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>You agree not to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Use the service for any unlawful purpose</li>
                      <li>Attempt to gain unauthorized access to any portion of the website</li>
                      <li>Modify, adapt, translate, or reverse engineer any portion of the website</li>
                      <li>Remove any copyright, trademark, or other proprietary notices</li>
                      <li>Use any robot, spider, or other automated device to access the website</li>
                      <li>Interfere with or disrupt the service or servers</li>
                      <li>Submit false or misleading information</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">4. Intellectual Property Rights</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      All content on Blynt, including but not limited to text, graphics, logos, images, and software, 
                      is the property of Blynt or its content suppliers and is protected by United States and 
                      international copyright laws. The compilation of all content on this site is the exclusive property of 
                      Blynt.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">5. User Content</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      By submitting content to Blynt, you grant us a worldwide, non-exclusive, royalty-free license 
                      to use, reproduce, modify, adapt, publish, translate, and distribute such content. You represent and warrant 
                      that you own or have the necessary rights to such content and that it does not violate any third party rights.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">6. Disclaimer of Warranties</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
                      WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, 
                      OR THAT THE WEBSITE OR SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">7. Limitation of Liability</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      BLYNT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE 
                      DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED 
                      THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE SERVICE.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">8. Third-Party Links</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      The website may contain links to third-party websites. These links are provided solely as a convenience 
                      and do not imply endorsement of or association with the linked sites. We are not responsible for the 
                      content, accuracy, or practices of any third-party websites.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">9. Termination</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      We reserve the right to terminate or suspend access to our service immediately, without prior notice or 
                      liability, for any reason whatsoever, including without limitation if you breach these Terms of Service.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">10. Governing Law</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of the United States and the 
                      State of [Your State], without regard to its conflict of law provisions. Any disputes arising under or 
                      in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located within 
                      [Your State].
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">11. Changes to Terms</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
                      provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
                      will be determined at our sole discretion.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">12. Contact Information</h2>
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p>
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Email: legal@getblynt.com</li>
                      <li>Address: [Your Business Address]</li>
                    </ul>
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