'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FilterTabsProps {
  currentFilter?: string
  patientId?: string
  onFilterChange?: (filter?: string) => void
}

const TABS = [
  { id: '', label: 'Todos' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'vistos', label: 'Vistos' },
  { id: 'favoritos', label: 'Favoritos' },
]

export function FilterTabs({ 
  currentFilter = '', 
  patientId,
  onFilterChange
}: FilterTabsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleFilter = (filter: string) => {
    if (onFilterChange) onFilterChange(filter || undefined)

    const params = new URLSearchParams()
    if (patientId) params.set('patientId', patientId)
    if (filter) params.set('filter', filter)
    
    const queryString = params.toString()
    startTransition(() => {
      router.push(`/nutritionist${queryString ? `?${queryString}` : ''}`)
    })
  }

  return (
    <div className="relative flex items-center gap-1 rounded-2xl bg-zinc-100/80 p-1.5 shadow-inner dark:bg-zinc-800/50">
      {TABS.map((tab) => {
        const isActive = currentFilter === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => handleFilter(tab.id)}
            className={cn(
              "relative px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 outline-none",
              isActive ? "text-sky-600 dark:text-sky-400" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-white shadow-md dark:bg-zinc-700"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
      
      {isPending && (
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-sky-500 animate-pulse border border-white dark:border-zinc-900" />
      )}
    </div>
  )
}
