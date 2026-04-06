'use client'

import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { addInteraction } from '@/app/nutritionist/actions'

interface NutritionistMealCardProps {
  meal: {
    id: string
    created_at: string
    meal_type: string
    comments: string
    photo_urls: string[]
    patient: { email: string }
  }
  interactions: any[]
}

export function NutritionistMealCard({ meal, interactions }: NutritionistMealCardProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const likes = interactions.filter((i) => i.type === 'like')
  const nutritionistComments = interactions.filter((i) => i.type === 'comment')

  const handleLike = async () => {
    const formData = new FormData()
    formData.append('mealId', meal.id)
    formData.append('type', 'like')
    try { await addInteraction(formData) } catch (err) { console.error(err) }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('mealId', meal.id)
    formData.append('type', 'comment')
    formData.append('content', comment)
    try { await addInteraction(formData); setComment('') } catch (err) { console.error(err) } finally { setIsSubmitting(false) }
  }

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-lg dark:border dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/30">{meal.patient.email[0].toUpperCase()}</div>
        <div><p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{meal.patient.email}</p><p className="text-xs text-zinc-500">{formatDistanceToNow(new Date(meal.created_at), { addSuffix: true, locale: es })}</p></div>
      </div>
      <div className="relative aspect-square w-full">
        {meal.photo_urls[0] ? <img src={meal.photo_urls[0]} alt={meal.meal_type} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800"><span className="text-sm text-zinc-400">Sin foto</span></div>}
        <div className="absolute top-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{meal.meal_type}</div>
      </div>
      <div className="p-4">
        {meal.comments && <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300 italic">"{meal.comments}"</p>}
        <div className="space-y-4 border-t border-zinc-100 pt-4 dark:border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`flex items-center gap-1 transition ${likes.length > 0 ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}>
              <Heart size={20} fill={likes.length > 0 ? 'currentColor' : 'none'} /><span className="text-xs font-medium">{likes.length > 0 ? 'Visto' : 'Dar Visto'}</span>
            </button>
            <div className="flex items-center gap-1 text-zinc-400"><MessageCircle size={20} /><span className="text-xs font-medium">{nutritionistComments.length} Comentarios</span></div>
          </div>
          {nutritionistComments.length > 0 && nutritionistComments.map((c: any) => <div key={c.id} className="rounded-lg bg-zinc-50 p-2 text-sm dark:bg-zinc-800/50 dark:text-zinc-300"><span className="font-bold text-blue-600 mr-2">Feedback:</span>{c.content}</div>)}
          <form onSubmit={handleComment} className="mt-4 flex items-center gap-2">
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Añadir feedback..." className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50" />
            <button type="submit" disabled={isSubmitting || !comment.trim()} className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  )
}
