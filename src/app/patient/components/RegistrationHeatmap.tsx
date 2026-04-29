'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HeatmapCell {
  day: number // 0-6 (Mon-Sun)
  hour: number // 0-23
  count: number
}

interface RegistrationHeatmapProps {
  data: HeatmapCell[]
}

export function RegistrationHeatmap({ data }: RegistrationHeatmapProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-zinc-100 dark:bg-zinc-800/50 border-transparent'
    const percentage = (count / maxCount) * 100
    if (percentage < 25) return 'bg-sky-200/50 dark:bg-sky-900/20 border-sky-200/50'
    if (percentage < 50) return 'bg-sky-400 dark:bg-sky-700/40 border-sky-400'
    if (percentage < 75) return 'bg-sky-600 text-white border-sky-600'
    return 'bg-indigo-700 shadow-sm shadow-indigo-500/20 text-white border-indigo-700'
  }

  const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col space-y-4">
      {/* Scrollable Container */}
      <div className="relative overflow-x-auto pb-6 scrollbar-hide">
        <div className="inline-flex min-w-full flex-col gap-2">
          
          {/* Header (Hours) */}
          <div className="flex items-center gap-2 pl-10">
            {hours.map(h => (
              <div key={h} className="w-8 flex-shrink-0 text-center">
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-tighter text-zinc-300",
                  h % 6 === 0 ? "text-zinc-500" : ""
                )}>
                  {h % 3 === 0 ? h.toString().padStart(2, '0') : ''}
                </span>
              </div>
            ))}
          </div>

          {/* Rows (Days) */}
          {days.map((dayName, dayIndex) => (
            <div key={dayIndex} className="flex items-center gap-2">
              {/* Day Label */}
              <div className="w-8 flex-shrink-0 text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {dayName[0]}
                </span>
              </div>

              {/* Cells */}
              <div className="flex gap-2">
                {hours.map(hour => {
                  const cellData = data.find(d => d.day === dayIndex && d.hour === hour)
                  const count = cellData?.count || 0
                  
                  return (
                    <motion.div
                      key={hour}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (dayIndex * 24 + hour) * 0.002 }}
                      className={cn(
                        "group relative h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all hover:z-10 hover:scale-125",
                        getIntensityClass(count)
                      )}
                    >
                      {count > 0 && <span className="text-[10px] font-black">{count}</span>}

                      {/* Tooltip */}
                      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-50 dark:text-zinc-900">
                        {dayName} {hour}:00 • {count} reg.
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Shadow indicator for scrolling */}
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none dark:from-zinc-900" />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Menos activo</span>
        <div className="flex gap-1.5">
          {[0, 25, 50, 75, 100].map((p) => (
            <div 
              key={p} 
              className={cn(
                "h-2 w-8 rounded-full",
                p === 0 ? 'bg-zinc-200 dark:bg-zinc-800' :
                p === 25 ? 'bg-sky-200' :
                p === 50 ? 'bg-sky-400' :
                p === 75 ? 'bg-sky-600' : 'bg-indigo-700'
              )}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Más activo</span>
      </div>
    </div>
  )
}
