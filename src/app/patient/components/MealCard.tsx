'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Heart, Edit2, X, Check } from 'lucide-react'
import { deleteMeal, updateMealText } from '@/app/patient/actions'

interface MealCardProps {
  meal: {
    id: string
    created_at: string
    meal_type: string
    comments: string
    photo_urls: string[]
    interactions?: {
      id: string
      type: 'like' | 'comment'
      content: string | null
      created_at: string
    }[]
  }
  isEditable: boolean
}

export function MealCard({ meal, isEditable }: MealCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedComments, setEditedComments] = useState(meal.comments || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await deleteMeal(meal.id)
      } catch (err) {
        alert('No se pudo eliminar. Solo es posible dentro de las 24 horas.')
      }
    }
  }

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      await updateMealText(meal.id, editedComments, meal.meal_type)
      setIsEditing(false)
    } catch (err) {
      alert('Error updating. Pleas try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-md dark:border dark:border-white/10 dark:bg-zinc-900">
      <div className="relative aspect-square w-full">
        {meal.photo_urls[0] ? (
          <img src={meal.photo_urls[0]} alt={meal.meal_type} className="h-full w-full object-cover" />
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
          {isEditable && !isEditing && (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="p-1 text-zinc-400 hover:text-blue-500" title="Editar texto">
                <Edit2 size={16} />
              </button>
              <button onClick={handleDelete} className="p-1 text-zinc-400 hover:text-red-500" title="Eliminar">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3">
            <textarea
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              rows={3}
              value={editedComments}
              onChange={(e) => setEditedComments(e.target.value)}
              placeholder="¿Qué comiste?"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800">
                <X size={16} />
              </button>
              <button onClick={handleUpdate} disabled={isUpdating} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                <Check size={14} /> Guardar
              </button>
            </div>
          </div>
        ) : (
          meal.comments && <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{meal.comments}</p>
        )}

        {meal.interactions && meal.interactions.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3 dark:border-white/10">
            {meal.interactions.map((interaction) => (
              <div key={interaction.id} className="flex flex-col gap-1">
                {interaction.type === 'like' ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-red-500">
                    <Heart size={12} fill="currentColor" />
                    <span>Tu nutricionista ha visto esta comida</span>
                  </div>
                ) : (
                  <div className="rounded-lg bg-blue-50 p-2 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    <span className="font-bold">Feedback:</span> {interaction.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {(!meal.interactions || meal.interactions.length === 0) && (
          <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-3 dark:border-white/10">
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Heart size={14} />
              <span>Sin feedback profesional aún</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
