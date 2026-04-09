'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Flame, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyProgressBarProps {
  current: number
  target?: number
}

export function DailyProgressBar({ current, target = 4 }: DailyProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const isComplete = current >= target

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-sky-500/5 blur-3xl dark:bg-sky-500/10" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-outfit text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Progreso Diario
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              {current} de {target} comidas registradas
            </p>
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-all duration-500",
            isComplete ? "bg-emerald-500 text-white" : "bg-sky-500 text-white"
          )}>
            {isComplete ? <Trophy size={24} /> : <Flame size={24} />}
          </div>
        </div>

        <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", bounce: 0, duration: 1.5 }}
            className={cn(
              "h-full transition-colors duration-500",
              isComplete ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-sky-400 to-sky-600"
            )}
          />
        </div>

        <div className="flex justify-between">
          {Array.from({ length: target }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                i < current ? "bg-sky-500 scale-125" : "bg-zinc-200 dark:bg-zinc-700"
              )} />
              <span className="text-[10px] font-black uppercase tracking-tight text-zinc-300 dark:text-zinc-600">
                M{i + 1}
              </span>
            </div>
          ))}
        </div>

        {isComplete && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
          >
            ¡Objetivo cumplido! Tu nutricionista está orgulloso.
          </motion.p>
        )}
      </div>
    </div>
  )
}
