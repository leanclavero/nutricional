'use client'

import React, { useState, useMemo } from 'react'
import { NutritionistMealCard } from './NutritionistMealCard'
import { FilterTabs } from './FilterTabs'
import { Search, Loader2, Inbox } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NutritionistFeedProps {
  initialMeals: any[]
  currentUserId: string
  patientId?: string
  initialFilter?: string
  patients: any[]
}

export function NutritionistFeed({ 
  initialMeals, 
  currentUserId, 
  patientId, 
  initialFilter = '',
  patients
}: NutritionistFeedProps) {
  const [filter, setFilter] = useState(initialFilter)

  const filteredMeals = useMemo(() => {
    let result = initialMeals || []
    if (filter === 'pendientes') {
      result = result.filter(m => !m.interactions.some((i: any) => i.type === 'like' && i.user_id === currentUserId))
    } else if (filter === 'vistos') {
      result = result.filter(m => m.interactions.some((i: any) => i.type === 'like' && i.user_id === currentUserId))
    } else if (filter === 'favoritos') {
      result = result.filter(m => m.interactions.some((i: any) => i.type === 'favorite' && i.user_id === currentUserId))
    }
    return result
  }, [initialMeals, filter, currentUserId])

  const patientName = useMemo(() => {
    if (!patientId) return 'Feed de Actividad Global'
    const p = patients?.find(p => p.id === patientId)
    return `Diario: ${p?.email.split('@')[0]}`
  }, [patientId, patients])

  return (
    <div className="flex-1 space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-outfit text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            {patientName}
          </motion.h2>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            {filteredMeals.length} registros encontrados
          </p>
        </div>
        
        <FilterTabs 
          currentFilter={filter} 
          patientId={patientId}
          onFilterChange={(newFilter) => setFilter(newFilter || '')}
        />
      </header>

      <div className="min-h-[500px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredMeals.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-sky-500/10 blur-2xl dark:bg-sky-500/5" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <Inbox size={40} className="text-sky-500" />
                </div>
              </div>
              <h3 className="font-outfit text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Todo despejado por aquí
              </h3>
              <p className="mt-2 max-w-xs text-sm font-medium leading-relaxed text-zinc-400">
                No hay comidas {filter ? `marcadas como "${filter}"` : 'registradas'} en este momento.
              </p>
              <button 
                onClick={() => setFilter('')}
                className="mt-6 rounded-full bg-sky-100 px-6 py-2 text-xs font-black uppercase tracking-widest text-sky-600 transition-all hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400"
              >
                Ver todas las comidas
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-1 xl:gap-16">
              {filteredMeals.map((meal) => (
                <NutritionistMealCard 
                  key={meal.id}
                  meal={meal} 
                  interactions={meal.interactions} 
                  currentUserId={currentUserId} 
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
