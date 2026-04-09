'use client'

import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Heart, MessageCircle, Send, Star, Edit2, Trash2, CheckCircle2, MoreHorizontal } from 'lucide-react'
import { addInteraction, toggleInteraction, deleteInteraction, updateInteraction } from '@/app/nutritionist/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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

const QUICK_REACTIONS = [
  { emoji: '💪', label: 'Excelente' },
  { emoji: '🥗', label: 'Equilibrado' },
  { emoji: '🍎', label: 'Saludable' },
  { emoji: '💧', label: 'Hidratación' },
  { emoji: '🥦', label: 'Vegetales' },
]

export function NutritionistMealCard({ meal, interactions, currentUserId }: NutritionistMealCardProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const isLiked = interactions.some((i) => i.type === 'like' && i.user_id === currentUserId)
  const isFavorite = interactions.some((i) => i.type === 'favorite' && i.user_id === currentUserId)
  const comments = interactions
    .filter((i) => i.type === 'comment')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
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

  const handleQuickReaction = async (reaction: string) => {
    const formData = new FormData()
    formData.append('mealId', meal.id)
    formData.append('type', 'comment')
    formData.append('content', reaction)
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
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative w-full max-w-lg overflow-hidden rounded-[2rem] glass transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10",
        isLiked ? "border-transparent" : "border-amber-100 dark:border-amber-900/30"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold shadow-lg shadow-sky-500/20">
            {meal.patient.email[0].toUpperCase()}
          </div>
          <div>
            <p className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">{meal.patient.email}</p>
            <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
              {new Date(meal.meal_date || meal.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <button className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full px-5">
        <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-inner">
          {meal.photo_urls[0] ? (
            <img src={meal.photo_urls[0]} alt={meal.meal_type} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900">
              <span className="font-outfit text-sm font-medium text-zinc-400">Sin registro visual</span>
            </div>
          )}
          
          {/* Status Badges Overlay */}
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-bold text-white uppercase backdrop-blur-xl border border-white/20">
              {meal.meal_type}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.div 
                key="pending"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-black text-white shadow-xl backdrop-blur-md"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                PENDIENTE
              </motion.div>
            ) : (
              <motion.div 
                key="checked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-black text-white shadow-xl backdrop-blur-md"
              >
                <CheckCircle2 size={12} className="stroke-[3px]" />
                VISTO
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-6">
        {/* Meal Comments */}
        {meal.comments && (
          <div className="mb-6 rounded-2xl bg-sky-50/50 p-4 dark:bg-sky-950/20">
            <p className="text-sm italic leading-relaxed text-sky-800 dark:text-sky-200">
              "{meal.comments}"
            </p>
          </div>
        )}

        {/* Quick Reaction Bar */}
        <div className="mb-6 flex items-center justify-around rounded-2xl bg-zinc-50/80 p-2 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50">
          {QUICK_REACTIONS.map((reac) => (
            <button
              key={reac.emoji}
              onClick={() => handleQuickReaction(reac.emoji)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-lg dark:hover:bg-zinc-700"
              title={reac.label}
            >
              <span className="text-xl">{reac.emoji}</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase">{reac.label}</span>
            </button>
          ))}
        </div>

        {/* Actions & Feedback */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => handleToggle('like')} 
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  isLiked ? 'text-sky-500 scale-110' : 'text-zinc-400 hover:text-sky-500 hover:scale-110'
                )}
              >
                <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} className="stroke-[2.5px]" />
                <span className="font-outfit text-xs font-bold uppercase tracking-wider">{isLiked ? 'Visto' : 'Marcar'}</span>
              </button>
              
              <button 
                onClick={() => handleToggle('favorite')} 
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  isFavorite ? 'text-amber-500 scale-110' : 'text-zinc-400 hover:text-amber-500 hover:scale-110'
                )}
              >
                <Star size={24} fill={isFavorite ? 'currentColor' : 'none'} className="stroke-[2.5px]" />
                <span className="font-outfit text-xs font-bold uppercase tracking-wider">{isFavorite ? 'Favorito' : 'Destacar'}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
              <MessageCircle size={18} className="stroke-[2.5px]" />
              <span className="text-xs font-black">{comments.length}</span>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {comments.map((c) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={c.id} 
                  className="group/comment rounded-2xl bg-zinc-50 p-4 text-sm dark:bg-zinc-800/40 border border-transparent transition-all hover:border-sky-100 dark:hover:border-sky-900/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">Feedback Nutricional</span>
                    {c.user_id === currentUserId && (
                      <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover/comment:opacity-100">
                        <button onClick={() => { setEditingId(c.id); setEditValue(c.content || '') }} className="text-zinc-400 hover:text-sky-500 transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingId === c.id ? (
                    <div className="mt-3 space-y-3">
                      <textarea 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)} 
                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-900" 
                      />
                      <div className="flex justify-end gap-3 text-[10px] font-bold uppercase tracking-wider">
                        <button onClick={() => setEditingId(null)} className="text-zinc-400">Cancelar</button>
                        <button onClick={() => handleUpdate(c.id)} className="text-sky-600">Guardar Cambios</button>
                      </div>
                    </div>
                  ) : (
                    <p className="leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">{c.content}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <form onSubmit={handleComment} className="relative mt-6">
              <input 
                type="text" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="Añadir comentario clínico..." 
                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 py-4 pl-5 pr-14 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-sky-500/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50" 
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !comment.trim()} 
                className="absolute right-2 top-2 rounded-xl bg-sky-500 p-2 text-white shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-600 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:shadow-none"
              >
                <Send size={20} className="stroke-[2.5px]" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
