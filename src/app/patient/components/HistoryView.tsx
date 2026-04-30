'use client'

import React, { useState } from 'react'
import { LayoutGrid, LayoutList, Calendar, History as HistoryIcon, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MealCard } from './MealCard'
import { MealDetailModal } from './MealDetailModal'

interface HistoryViewProps {
  meals: any[]
  currentUserId: string
}

export function HistoryView({ meals, currentUserId }: HistoryViewProps) {
  const [view, setView] = useState<'grid' | 'feed'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null)

  const categories = ['Todas', 'Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Snack', 'Actividad Física', 'Suplementación', 'Hidratación']

  const filteredMeals = selectedCategory === 'Todas' 
    ? meals 
    : meals.filter(m => m.meal_type === selectedCategory)

  const isWithin24Hours = (date: string) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    return diff < 24
  }

  if (!meals || meals.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-zinc-100 text-zinc-300 dark:bg-zinc-900">
          <HistoryIcon size={40} strokeWidth={1} />
        </div>
        <h3 className="mt-6 font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">Sin registros</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 px-10">Aún no has registrado ninguna comida en tu historia.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toggle View */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            onClick={() => setView('grid')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
              view === 'grid' 
                ? "bg-white text-sky-600 shadow-sm dark:bg-zinc-900 dark:text-sky-400" 
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500"
            )}
          >
            <LayoutGrid size={14} /> Cuadrícula
          </button>
          <button
            onClick={() => setView('feed')}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
              view === 'feed' 
                ? "bg-white text-sky-600 shadow-sm dark:bg-zinc-900 dark:text-sky-400" 
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500"
            )}
          >
            <LayoutList size={14} /> Feed
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto pb-2 px-1 gap-2 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border",
              selectedCategory === cat
                ? "bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20"
                : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-3 gap-1 px-1"
          >
            {filteredMeals.map((meal) => {
              const photo = meal.photo_urls?.[0]
              return (
                <div 
                  key={meal.id} 
                  onClick={() => setSelectedMeal(meal)}
                  className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-50 dark:border-zinc-800 cursor-pointer"
                >
                  {photo ? (
                    <img 
                      src={photo} 
                      alt={meal.meal_type} 
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">Sin foto</span>
                    </div>
                  )}
                  {/* Badge indicating multiple photos */}
                  {meal.photo_urls?.length > 1 && (
                    <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                      <LayoutGrid size={8} />
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-8"
          >
            {filteredMeals.map((meal) => (
              <MealCard 
                key={meal.id} 
                meal={meal} 
                isEditable={isWithin24Hours(meal.meal_date || meal.created_at)} 
                currentUserId={currentUserId} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <MealDetailModal 
        meal={selectedMeal} 
        isOpen={!!selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
        currentUserId={currentUserId}
      />
    </div>
  )
}
