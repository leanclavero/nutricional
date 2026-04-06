'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Heart, MessageCircle } from 'lucide-react'
import { deleteMeal } from '@/app/patient/actions'

interface MealCardProps {
  meal: {
    id: string
    created_at: string
    meal_type: string
    comments: string
    photo_urls: string[]
  }
  isEditable: boolean
}

export function MealCard({ meal, isEditable }: MealCardProps) {
  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await deleteMeal(meal.id)
      } catch (err) {
        alert('No se pudo eliminar el registro. Recuerda que solo se puede hacer dentro de las 24 horas siguientes.')
      }
    }
  }

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-md dark:border dark:border-white/10 dark:bg-zinc-900">
      <div className="relative aspect-square w-full">
        {meal.photo_urls[0] ? (
          <img
            src={meal.photo_urls[0]}
            alt={meal.meal_type}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <span className="text-sm text-zinc-400">Sin foto</span>
          </div>
        )}
        <div className="absolute top-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {meal.meal_type}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatDistanceToNow(new Date(meal.created_at), { addSuffix: true, locale: es })}
          </span>
          {isEditable && (
            <button
              onClick={handleDelete}
              className="p-1 text-zinc-400 transition hover:text-red-500"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {meal.comments && (
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            {meal.comments}
          </p>
        )}

        {/* Placeholder for interactions count in the future */}
        <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-3 dark:border-white/10">
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Heart size={14} />
            <span>Me gusta</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <MessageCircle size={14} />
            <span>Comentar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
