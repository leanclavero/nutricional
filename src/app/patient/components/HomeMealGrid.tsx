'use client'

import React, { useState } from 'react'
import { HomeMealCard } from './HomeMealCard'
import { MealDetailModal } from './MealDetailModal'

interface HomeMealGridProps {
  meals: any[]
  currentUserId: string
}

export function HomeMealGrid({ meals, currentUserId }: HomeMealGridProps) {
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null)

  const getSpan = (index: number, total: number) => {
    if (total === 1) return "col-span-6"
    if (total === 2) return "col-span-3"
    if (total === 3) return "col-span-2"
    if (total === 4) return "col-span-3"
    if (total === 5) {
      return index < 3 ? "col-span-2" : "col-span-3"
    }
    return "col-span-2"
  }

  return (
    <>
      <div className="grid grid-cols-6 gap-2">
        {meals.map((meal, idx) => (
          <div key={meal.id} className={getSpan(idx, meals.length)}>
            <HomeMealCard meal={meal} onClick={() => setSelectedMeal(meal)} />
          </div>
        ))}
      </div>

      <MealDetailModal 
        meal={selectedMeal} 
        isOpen={!!selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
        currentUserId={currentUserId}
      />
    </>
  )
}
