import { cn } from "@/lib/utils"
import Link from "next/link"

interface ListItemProps {
  className?: string
  title: string
  href: string
}

export function ListItem({ className, title, href }: ListItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
      </Link>
    </li>
  )
} 