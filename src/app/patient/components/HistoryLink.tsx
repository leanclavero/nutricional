'use client'

import { motion } from 'framer-motion'
import { CalendarDays, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function HistoryLink() {
  return (
    <Link href="/patient/history">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex items-center justify-between overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-sky-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500 transition-colors group-hover:bg-sky-50 group-hover:text-sky-500 dark:bg-zinc-800 dark:group-hover:bg-sky-950/30">
            <CalendarDays size={24} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-100">Ver Historial</h3>
            <p className="text-xs text-zinc-500">Consulta tus registros anteriores</p>
          </div>
        </div>
        
        <div className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-sky-500">
          <ChevronRight size={20} />
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-sky-500/5 blur-2xl group-hover:bg-sky-500/10" />
      </motion.div>
    </Link>
  )
}
