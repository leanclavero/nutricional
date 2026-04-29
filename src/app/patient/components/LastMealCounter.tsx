'use client'

import { useState, useEffect } from 'react'
import { Timer, History, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { differenceInMinutes, differenceInHours, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface LastMealCounterProps {
  lastMealDate: string | null
}

export function LastMealCounter({ lastMealDate }: LastMealCounterProps) {
  const [timeText, setTimeText] = useState<string>('')
  const [isLongTime, setIsLongTime] = useState(false)

  useEffect(() => {
    if (!lastMealDate) return

    const updateCounter = () => {
      const now = new Date()
      const last = new Date(lastMealDate)
      
      const hours = differenceInHours(now, last)
      const minutes = differenceInMinutes(now, last) % 60

      if (hours >= 4) {
        setIsLongTime(true)
      } else {
        setIsLongTime(false)
      }

      if (hours === 0) {
        setTimeText(`${minutes}m`)
      } else {
        setTimeText(`${hours}h ${minutes}m`)
      }
    }

    updateCounter()
    const interval = setInterval(updateCounter, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [lastMealDate])

  if (!lastMealDate) {
    return (
      <div className="rounded-2xl bg-zinc-100 p-4 text-center dark:bg-zinc-900">
        <p className="text-xs font-medium text-zinc-500">No hay registros de comidas aún.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isLongTime ? 'bg-orange-100 text-orange-500 dark:bg-orange-950/30' : 'bg-sky-100 text-sky-500 dark:bg-sky-950/30'}`}>
            <Timer size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Tiempo desde la última ingesta
            </p>
            <h3 className="font-outfit text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {timeText}
            </h3>
          </div>
        </div>
        
        {isLongTime && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-bold text-orange-600 dark:text-orange-400"
          >
            <AlertCircle size={10} />
            <span>Recordatorio</span>
          </motion.div>
        )}
      </div>

      {/* Subtle background glow */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 ${isLongTime ? 'bg-orange-500' : 'bg-sky-500'}`} />
    </motion.div>
  )
}
