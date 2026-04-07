'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Heart, Edit2, X, Check, Calendar, Send } from 'lucide-react'
import { deleteMeal, updateMeal, addPatientComment } from '@/app/patient/actions'

interface MealCardProps {
  meal: {
    id: string
    created_at: string
    meal_type: string
    comments: string
    meal_date: string
    photo_urls: string[]
    interactions: {
      id: string
      user_id: string
      type: 'like' | 'comment' | 'favorite'
      content: string | null
      created_at: string
    }[]
  }
  isEditable: boolean
  currentUserId: string
}

export function MealCard({ meal, isEditable, currentUserId }: MealCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedComments, setEditedComments] = useState(meal.comments || '')
  const [editedMealDate, setEditedMealDate] = useState(new Date(meal.meal_date || meal.created_at).toISOString().slice(0, 16))
  const [isUpdating, setIsUpdating] = useState(false)

  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePatientComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setIsSubmitting(true)
    try {
      await addPatientComment(meal.id, newComment)
      setNewComment('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

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
      await updateMeal(meal.id, editedComments, meal.meal_type, new Date(editedMealDate).toISOString())
      setIsEditing(false)
    } catch (err) {
      alert('Error updating. Please try again.')
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
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Calendar size={12} className="text-zinc-400" />
            <span>
              {new Date(meal.meal_date || meal.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
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
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Comentarios</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                rows={3}
                value={editedComments}
                onChange={(e) => setEditedComments(e.target.value)}
                placeholder="¿Qué comiste?"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Día y Hora</label>
              <input 
                type="datetime-local" 
                value={editedMealDate}
                onChange={(e) => setEditedMealDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              />
            </div>
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
          <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4 dark:border-white/10">
            {meal.interactions.map((interaction) => (
              <div key={interaction.id} className="flex flex-col gap-1">
                {interaction.type === 'like' && (
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    <Check size={12} />
                    <span>Tu nutricionista ha visto esta comida</span>
                  </div>
                )}
                {interaction.type === 'comment' && (
                  <div className={`rounded-xl p-3 text-xs ${interaction.user_id === currentUserId ? 'bg-zinc-100 dark:bg-zinc-800 ml-6 text-zinc-800' : 'bg-blue-50 dark:bg-blue-900/30 mr-6 text-blue-900 dark:text-blue-200'}`}>
                    <span className="mb-1 block text-[9px] font-black uppercase tracking-tight opacity-50">
                      {interaction.user_id === currentUserId ? 'Tu mensaje' : 'Feedback Nutricionista'}
                    </span>
                    {interaction.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handlePatientComment} className="mt-4 flex items-center gap-2 border-t border-zinc-50 pt-4 dark:border-white/5">
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Responder o añadir nota..."
            className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
