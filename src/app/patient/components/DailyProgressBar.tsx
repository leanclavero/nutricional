'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface DailyProgressBarProps {
  current: number
  target?: number
  meals?: any[]
}

export function DailyProgressBar({ current, target = 4, meals = [] }: DailyProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const isComplete = current >= target

  // Sort meals by date ascending for the dots
  const sortedMeals = [...meals].sort((a, b) => 
    new Date(a.meal_date || a.created_at).getTime() - new Date(b.meal_date || b.created_at).getTime()
  )

  const defaultLabels = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Snack', 'M6', 'M7', 'M8']

  return (
    <div className="overflow-hidden rounded-2xl bg-white px-4 py-3.5 shadow-sm border border-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-500",
            isComplete ? "bg-emerald-500 text-white" : "bg-sky-500 text-white"
          )}>
            {isComplete ? <Trophy size={13} /> : <Flame size={13} />}
          </div>
          <div>
            <h3 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Comidas de hoy
            </h3>
            <p className="text-[10px] text-zinc-400">
              {current === 0
                ? 'Aún no registraste ninguna'
                : current >= target
                ? '¡Objetivo cumplido!'
                : `${current} de ${target} registradas`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/patient/settings/goals" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 transition-all hover:bg-sky-50 hover:text-sky-500 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:bg-sky-900/20 dark:hover:text-sky-400 border border-zinc-100 dark:border-zinc-800">
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 1.2 }}
          className={cn(
            "h-full rounded-full",
            isComplete
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-sky-400 to-sky-500"
          )}
        />
      </div>

      {/* Meal dots */}
      <div className="mt-2 flex justify-between">
        {Array.from({ length: target }).map((_, i) => {
          const meal = sortedMeals[i]
          const isFilled = i < current
          
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                isFilled ? (isComplete ? "bg-emerald-500" : "bg-sky-500") : "bg-zinc-200 dark:bg-zinc-700"
              )} />
              <span className={cn(
                "text-[8px] font-semibold truncate max-w-[48px]",
                isFilled ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-300 dark:text-zinc-600"
              )}>
                {meal ? meal.meal_type : (defaultLabels[i] || `M${i + 1}`)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
