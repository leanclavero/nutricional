'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Heart, Edit2, X, Check, Calendar, Send, MessageSquare } from 'lucide-react'
import { deleteMeal, updateMeal, addPatientComment } from '@/app/patient/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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

  const isFavorited = meal.interactions?.some(i => i.type === 'favorite')
  const isSeen = meal.interactions?.some(i => i.type === 'like')

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all duration-500 hover:shadow-sky-500/10 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {meal.photo_urls[0] ? (
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={meal.photo_urls[0]} 
            alt={meal.meal_type} 
            className="h-full w-full object-cover" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <span className="text-sm font-black uppercase tracking-widest text-zinc-300">Sin Registro Visual</span>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
          <div className="rounded-2xl bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 shadow-xl backdrop-blur-md dark:bg-zinc-900/90 dark:text-zinc-50">
            {meal.meal_type}
          </div>
          
          <div className="flex gap-2">
            {isSeen && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <Check size={20} />
              </div>
            )}
            {isFavorited && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg shadow-amber-400/20">
                <Heart size={20} fill="currentColor" />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons (Hover) */}
        {isEditable && !isEditing && (
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-zinc-900/20 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-xl transition-transform hover:scale-110 active:scale-95 dark:bg-zinc-800 dark:text-sky-400"
            >
              <Edit2 size={20} />
            </button>
            <button 
              onClick={handleDelete}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-500 shadow-xl transition-transform hover:scale-110 active:scale-95 dark:bg-zinc-800"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <Calendar size={14} className="text-sky-500" />
          <span>
            {new Date(meal.meal_date || meal.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <textarea
                className="w-full rounded-2xl border-none bg-zinc-50 p-4 text-sm font-medium text-zinc-900 ring-1 ring-zinc-200 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
                rows={3}
                value={editedComments}
                onChange={(e) => setEditedComments(e.target.value)}
                placeholder="Describe tu comida..."
              />
              <div className="flex gap-2">
                <input 
                  type="datetime-local" 
                  value={editedMealDate}
                  onChange={(e) => setEditedMealDate(e.target.value)}
                  className="flex-1 rounded-xl border-none bg-zinc-50 px-4 py-2 text-xs font-bold ring-1 ring-zinc-200 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
                />
                <button onClick={() => setIsEditing(false)} className="rounded-xl bg-zinc-100 p-2 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800">
                  <X size={20} />
                </button>
                <button onClick={handleUpdate} disabled={isUpdating} className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-black uppercase text-white shadow-lg shadow-sky-500/20">
                  Guardar
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-300"
            >
              {meal.comments || <span className="italic text-zinc-400">Sin descripción</span>}
            </motion.p>
          )}
        </AnimatePresence>
        
        {/* Interactions Feed */}
        <div className="mt-8 space-y-4 border-t border-zinc-50 pt-8 dark:border-white/5">
          {meal.interactions?.filter(i => i.type === 'comment').map((comment) => (
            <div key={comment.id} className={cn(
              "relative rounded-3xl p-4 text-sm shadow-sm transition-all",
              comment.user_id === currentUserId 
                ? "ml-8 bg-zinc-50 dark:bg-zinc-800/50" 
                : "mr-8 bg-sky-50 text-sky-900 ring-1 ring-sky-100 dark:bg-sky-900/20 dark:text-sky-100 dark:ring-sky-500/20"
            )}>
              <span className="mb-1 block text-[9px] font-black uppercase tracking-widest opacity-40">
                {comment.user_id === currentUserId ? 'Tú' : 'Nutricionista'}
              </span>
              <p className="font-medium leading-relaxed">{comment.content}</p>
            </div>
          ))}

          <form onSubmit={handlePatientComment} className="flex items-center gap-3">
            <div className="relative flex-1">
              <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full rounded-2xl border-none bg-zinc-50 py-3 pl-11 pr-4 text-xs font-medium ring-1 ring-zinc-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:ring-zinc-800"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || !newComment.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
