'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Utensils, Dumbbell, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface HomeMealCardProps {
  meal: {
    id: string
    meal_type: string
    photo_urls: string[]
    meal_date: string
  }
}

export function HomeMealCard({ meal }: HomeMealCardProps) {
  const photo = meal.photo_urls?.[0]
  const isPhysical = meal.meal_type === 'Actividad Física'

  return (
    <Link href="/patient/history">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative aspect-square overflow-hidden rounded-3xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
      >
        {photo ? (
          <img 
            src={photo} 
            alt={meal.meal_type} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <LayoutGrid size={24} className="text-zinc-200 dark:text-zinc-800" />
          </div>
        )}

        {/* Overlay Badge */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-6">
          <div className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md",
            isPhysical ? "bg-orange-500/80" : "bg-black/40"
          )}>
            {isPhysical ? <Dumbbell size={8} /> : <Utensils size={8} />}
            {meal.meal_type}
          </div>
        </div>

        {/* Multiple Photos Indicator */}
        {meal.photo_urls?.length > 1 && (
          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <LayoutGrid size={10} />
          </div>
        )}
      </motion.div>
    </Link>
  )
}
