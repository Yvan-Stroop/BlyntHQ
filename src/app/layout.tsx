// Test automatic deployment - This comment will verify Coolify's auto-deploy feature
import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { generateGlobalSchema } from '@/lib/schemas'
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { GoogleAnalytics } from '@next/third-parties/google'
import { loadCategoriesFromCSV, loadLocationsFromCSV, transformLocationsToStateCity } from "@/lib/csv"
import { cn } from "@/lib/utils"
import { GoogleAnalyticsRouteTracker } from '@/components/analytics/route-tracker'
import Script from 'next/script'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  other: {
    'shortcut icon': '/favicon/favicon.ico',
    'msapplication-TileImage': '/favicon/favicon.ico',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, locations] = await Promise.all([
    loadCategoriesFromCSV(),
    loadLocationsFromCSV()
  ])

  const locationData = {
    states: transformLocationsToStateCity(locations),
    locations: locations
  }

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateGlobalSchema())
          }}
        />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body 
        key="root-layout"
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          inter.className
        )}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <Header categories={categories} states={locationData.states} />
            <main className="flex-1 w-full overflow-hidden">{children}</main>
            <Footer categories={categories} locations={locationData.locations} />
          </div>
          <Toaster />
          <Suspense>
            <GoogleAnalyticsRouteTracker />
          </Suspense>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  )
}