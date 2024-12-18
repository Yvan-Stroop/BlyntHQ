"use client"

import { 
  IconShieldCheck, 
  IconUsers,
  IconMapSearch,
  IconStarsFilled,
  IconArrowUpRight,
  IconBuildingStore,
  IconClock24
} from '@tabler/icons-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  { value: "50K+", label: "Active Businesses" },
  { value: "100K+", label: "Monthly Users" },
  { value: "98%", label: "Verified Listings" },
  { value: "24/7", label: "Support Available" },
];

const benefits = [
  {
    icon: IconShieldCheck,
    title: "Verified Businesses",
    description: "Every listing is manually verified for authenticity and updated regularly",
  },
  {
    icon: IconMapSearch,
    title: "Local Focus",
    description: "Find businesses in your area with detailed location-based search",
  },
  {
    icon: IconStarsFilled,
    title: "Real Reviews",
    description: "Genuine customer reviews and ratings you can trust",
  },
  {
    icon: IconClock24,
    title: "Always Updated",
    description: "Real-time updates on business hours, services, and availability",
  },
];

const features = [
  {
    icon: IconUsers,
    title: "For Business Owners",
    description: "Claim and manage your business listing to reach more customers",
    action: "Claim Your Business",
    link: "/claim-business"
  },
  {
    icon: IconBuildingStore,
    title: "Add Your Business",
    description: "Not listed yet? Add your business to our directory for free",
    action: "Add Business",
    link: "/add-business"
  },
];

export function TrustSignals() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container space-y-16">
        {/* Stats Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl" />
          <div className="relative px-6 py-12 md:py-16 rounded-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat) => (
                <div 
                  key={stat.label} 
                  className="text-center space-y-2 group"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground group-hover:text-primary transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Why Choose Blynt
            </h2>
            <p className="text-muted-foreground">
              Your trusted source for discovering and connecting with local businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="group hover:shadow-md transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 bg-primary/5 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-6 h-6 text-primary" stroke={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="group hover:shadow-md transition-all border-primary/10"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-8 h-8 text-primary" stroke={1.5} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Button asChild className="w-full md:w-auto">
                      <Link href={feature.link} className="group/btn">
                        {feature.action}
                        <IconArrowUpRight 
                          className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" 
                          stroke={1.5}
                        />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}