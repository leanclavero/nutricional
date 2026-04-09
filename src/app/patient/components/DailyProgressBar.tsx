'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyProgressBarProps {
  current: number
  target?: number
}

export function DailyProgressBar({ current, target = 4 }: DailyProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const isComplete = current >= target

  const mealLabels = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena']

  return (
    <div className="overflow-hidden rounded-2xl bg-white px-4 py-3.5 shadow-sm border border-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-500",
              isComplete ? "bg-emerald-500 text-white" : "bg-sky-500 text-white"
            )}>
              {isComplete ? <Trophy size={13} /> : <Flame size={13} />}
            </div>
            <h3 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Comidas de hoy
            </h3>
          </div>
          <p className="mt-0.5 text-[10px] text-zinc-400">
            {current === 0
              ? 'Aún no registraste ninguna'
              : current >= target
              ? '¡Objetivo del día cumplido!'
              : `${current} de ${target} registradas`}
          </p>
        </div>
        <span className={cn(
          "text-lg font-black tabular-nums",
          isComplete ? "text-emerald-500" : "text-sky-500"
        )}>
          {current}<span className="text-sm font-semibold text-zinc-300">/{target}</span>
        </span>
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
        {Array.from({ length: target }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={cn(
              "h-1.5 w-1.5 rounded-full transition-all duration-300",
              i < current ? (isComplete ? "bg-emerald-500" : "bg-sky-500") : "bg-zinc-200 dark:bg-zinc-700"
            )} />
            <span className="text-[8px] font-semibold text-zinc-300 dark:text-zinc-600 truncate max-w-[48px]">
              {mealLabels[i] || `M${i + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
