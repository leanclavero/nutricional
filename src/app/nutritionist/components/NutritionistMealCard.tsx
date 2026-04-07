'use client'

import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Heart, MessageCircle, Send, Star, Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import { addInteraction, toggleInteraction, deleteInteraction, updateInteraction } from '@/app/nutritionist/actions'

interface NutritionistMealCardProps {
  meal: {
    id: string
    created_at: string
    meal_type: string
    comments: string
    meal_date: string
    photo_urls: string[]
    patient: { email: string }
  }
  interactions: {
    id: string
    user_id: string
    type: 'like' | 'comment' | 'favorite'
    content: string | null
    created_at: string
  }[]
  currentUserId: string
}

export function NutritionistMealCard({ meal, interactions, currentUserId }: NutritionistMealCardProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const isLiked = interactions.some((i) => i.type === 'like' && i.user_id === currentUserId)
  const isFavorite = interactions.some((i) => i.type === 'favorite' && i.user_id === currentUserId)
  const comments = interactions.filter((i) => i.type === 'comment')
  const isPending = !isLiked

  const handleToggle = async (type: 'like' | 'favorite') => {
    try { await toggleInteraction(meal.id, type) } catch (err) { console.error(err) }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este comentario?')) {
      try { await deleteInteraction(id) } catch (err) { console.error(err) }
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return
    try { 
      await updateInteraction(id, editValue)
      setEditingId(null)
    } catch (err) { console.error(err) }
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
        <div><p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{meal.patient.email}</p><p className="text-xs text-zinc-500">{new Date(meal.meal_date || meal.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div>
      </div>
      <div className="relative aspect-square w-full">
        {meal.photo_urls[0] ? <img src={meal.photo_urls[0]} alt={meal.meal_type} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800"><span className="text-sm text-zinc-400">Sin foto</span></div>}
        <div className="absolute top-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{meal.meal_type}</div>
        {isPending ? (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-blue-500/40">
            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            PENDIENTE
          </div>
        ) : (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg">
            <CheckCircle2 size={12} />
            VISTO
          </div>
        )}
      </div>
      <div className="p-4">
        {meal.comments && <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300 italic">"{meal.comments}"</p>}
        <div className="space-y-4 border-t border-zinc-100 pt-4 dark:border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={() => handleToggle('like')} className={`flex items-center gap-1.5 transition ${isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}>
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} /><span className="text-xs font-semibold">{isLiked ? 'Visto' : 'Marcar Visto'}</span>
            </button>
            <button onClick={() => handleToggle('favorite')} className={`flex items-center gap-1.5 transition ${isFavorite ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'}`}>
              <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} /><span className="text-xs font-semibold">{isFavorite ? 'Favorita' : 'Destacar'}</span>
            </button>
            <div className="flex items-center gap-1 text-zinc-400"><MessageCircle size={20} /><span className="text-xs font-medium">{comments.length}</span></div>
          </div>
          {comments.length > 0 && comments.map((c) => (
            <div key={c.id} className="group rounded-xl bg-zinc-50 p-3 text-sm dark:bg-zinc-800/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Feedback Nutricionista</span>
                {c.user_id === currentUserId && (
                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => { setEditingId(c.id); setEditValue(c.content || '') }} className="text-zinc-400 hover:text-blue-500"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(c.id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={12} /></button>
                  </div>
                )}
              </div>
              {editingId === c.id ? (
                <div className="mt-2 space-y-2">
                  <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
                  <div className="flex justify-end gap-2 text-xs">
                    <button onClick={() => setEditingId(null)} className="text-zinc-500">Cancelar</button>
                    <button onClick={() => handleUpdate(c.id)} className="font-bold text-blue-600">Guardar</button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-800 dark:text-zinc-200">{c.content}</p>
              )}
            </div>
          ))}
          <form onSubmit={handleComment} className="mt-4 flex items-center gap-2">
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Añadir feedback..." className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50" />
            <button type="submit" disabled={isSubmitting || !comment.trim()} className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  )
}
