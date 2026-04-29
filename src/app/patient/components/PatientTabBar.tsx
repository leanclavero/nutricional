'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, Plus, Stethoscope, Menu } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PatientTabBarProps {
  onPlusClick: () => void
  onMoreClick: () => void
}

export function PatientTabBar({ onPlusClick, onMoreClick }: PatientTabBarProps) {
  const pathname = usePathname()

  const tabs = [
    { label: 'Inicio', icon: Home, href: '/patient' },
    { label: 'Historial', icon: CalendarDays, href: '/patient/history' },
    { label: null, icon: Plus, href: null }, // center FAB
    { label: 'Mi Nutri', icon: Stethoscope, href: '/patient#nutri' },
    { label: 'Ver más', icon: Menu, href: null, isMore: true },
  ]

  return (
    <>
      {/* Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-zinc-100 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90 safe-area-inset-bottom">
        {tabs.map((tab, i) => {
          const Icon = tab.icon

          // Center FAB button
          if (tab.href === null && tab.label === null) {
            return (
              <button
                key={i}
                onClick={onPlusClick}
                className="-mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition-all active:scale-95 hover:bg-sky-600"
                aria-label="Nuevo registro"
              >
                <Plus size={26} strokeWidth={2.5} />
              </button>
            )
          }

          // More button
          if (tab.isMore) {
            return (
              <button
                key={i}
                onClick={onMoreClick}
                className="flex flex-col items-center gap-0.5 px-3 py-1 text-zinc-400 transition-colors hover:text-sky-500"
                aria-label="Ver más"
              >
                <Icon size={20} />
                <span className="text-[9px] font-semibold">{tab.label}</span>
              </button>
            )
          }

          // Regular link tabs
          const isActive = tab.href ? (tab.href === '/patient' ? pathname === '/patient' : pathname.startsWith(tab.href)) : false

          return (
            <Link
              key={i}
              href={tab.href!}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                isActive ? "text-sky-500" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <div className="relative">
                <Icon size={20} />
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-500"
                  />
                )}
              </div>
              <span className={cn("text-[9px] font-semibold", isActive && "text-sky-500")}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
