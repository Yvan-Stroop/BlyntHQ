'use client'

import { Button } from '@/components/ui/button'
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react'

export function SocialLinks() {
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2"
        onClick={() => window.open('https://www.facebook.com/BlyntHQ', '_blank')}
      >
        <IconBrandFacebook className="w-4 h-4" />
        Follow on Facebook
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2"
        onClick={() => window.open('https://www.instagram.com/blynthq/', '_blank')}
      >
        <IconBrandInstagram className="w-4 h-4" />
        Follow on Instagram
      </Button>
    </div>
  )
} 