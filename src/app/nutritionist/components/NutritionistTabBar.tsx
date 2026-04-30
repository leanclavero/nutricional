'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Calendar, User, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NutritionistTabBar() {
  const pathname = usePathname()

  const tabs = [
    { icon: Home, label: 'Feed', href: '/nutritionist' },
    { icon: Users, label: 'Pacientes', href: '/nutritionist/patients' },
    { icon: Calendar, label: 'Turnos', href: '/nutritionist/appointments' },
    { icon: User, label: 'Perfil', href: '/nutritionist/profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-zinc-100 bg-white/90 px-4 pb-2 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== '/nutritionist' && pathname.startsWith(tab.href))
        const Icon = tab.icon

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300",
              isActive ? "text-sky-500 scale-110" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
              isActive ? "bg-sky-50 dark:bg-sky-500/10 shadow-inner" : "bg-transparent"
            )}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              isActive ? "opacity-100" : "opacity-0"
            )}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
