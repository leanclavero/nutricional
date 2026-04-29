'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HeatmapData {
  hour: number
  count: number
}

interface RegistrationHeatmapProps {
  data: HeatmapData[]
}

export function RegistrationHeatmap({ data }: RegistrationHeatmapProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-zinc-100 dark:bg-zinc-800/50'
    const percentage = (count / maxCount) * 100
    if (percentage < 25) return 'bg-sky-100 dark:bg-sky-900/20 text-sky-600'
    if (percentage < 50) return 'bg-sky-300 dark:bg-sky-700/40 text-sky-700'
    if (percentage < 75) return 'bg-sky-500 text-white'
    return 'bg-sky-600 shadow-lg shadow-sky-500/20 text-white'
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {hours.map((hour) => {
          const hourData = data.find(d => d.hour === hour)
          const count = hourData?.count || 0
          
          return (
            <motion.div
              key={hour}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: hour * 0.02 }}
              className={cn(
                "group relative flex aspect-square flex-col items-center justify-center rounded-2xl border border-zinc-50 transition-all hover:z-10 hover:scale-110 dark:border-zinc-800",
                getIntensityClass(count)
              )}
            >
              <span className="text-[10px] font-black opacity-40">
                {hour.toString().padStart(2, '0')}
              </span>
              <span className="font-outfit text-sm font-bold">
                {count > 0 ? count : ''}
              </span>

              {/* Tooltip-like detail on hover */}
              <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-50 dark:text-zinc-900">
                {hour}:00 - {count} registros
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Menos activo</span>
        <div className="flex gap-1">
          {[0, 25, 50, 75, 100].map((p) => (
            <div 
              key={p} 
              className={cn(
                "h-2 w-6 rounded-full",
                p === 0 ? 'bg-zinc-200 dark:bg-zinc-800' :
                p === 25 ? 'bg-sky-100' :
                p === 50 ? 'bg-sky-300' :
                p === 75 ? 'bg-sky-500' : 'bg-sky-700'
              )}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Más activo</span>
      </div>
    </div>
  )
}
