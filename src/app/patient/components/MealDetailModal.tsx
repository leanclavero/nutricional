'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { MealCard } from './MealCard'

interface MealDetailModalProps {
  meal: any | null
  isOpen: boolean
  onClose: () => void
  currentUserId: string
}

export function MealDetailModal({ meal, isOpen, onClose, currentUserId }: MealDetailModalProps) {
  if (!meal) return null

  const isWithin24Hours = (date: string) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    return diff < 24
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] z-[110] mx-auto max-w-lg overflow-y-auto rounded-[3rem] bg-zinc-50 shadow-2xl dark:bg-zinc-950 hide-scrollbar"
          >
            <div className="sticky top-0 z-50 flex justify-end p-4">
              <button 
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="px-4 pb-12">
              <MealCard 
                meal={meal} 
                isEditable={isWithin24Hours(meal.meal_date || meal.created_at)} 
                currentUserId={currentUserId} 
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
