'use client'

import { useState, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Heart, Edit2, X, Check, Calendar, Send, MessageSquare, Plus, ImagePlus, ChevronLeft, ChevronRight, Dumbbell, Utensils } from 'lucide-react'
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

const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        const scaleSize = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1
        canvas.width = img.width * scaleSize
        canvas.height = img.height * scaleSize
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => { if (blob) resolve(blob) }, 'image/jpeg', 0.8)
      }
    }
  })
}

export function MealCard({ meal, isEditable, currentUserId }: MealCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedComments, setEditedComments] = useState(meal.comments || '')
  const [editedMealDate, setEditedMealDate] = useState(new Date(meal.meal_date || meal.created_at).toISOString().slice(0, 16))
  const [isUpdating, setIsUpdating] = useState(false)
  
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentImageIdx, setCurrentImageIdx] = useState(0)

  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const index = Math.round(container.scrollLeft / container.clientWidth)
    if (index !== currentImageIdx) {
      setCurrentImageIdx(index)
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: 'smooth'
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setNewFiles(prev => [...prev, ...selectedFiles])
      
      selectedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => setNewPreviews(prev => [...prev, reader.result as string])
        reader.readAsDataURL(file)
      })
    }
    e.target.value = ''
  }

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => prev.filter((_, i) => i !== index))
  }

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
      const formData = new FormData()
      formData.append('mealId', meal.id)
      formData.append('comments', editedComments)
      formData.append('mealType', meal.meal_type)
      formData.append('mealDate', new Date(editedMealDate).toISOString())

      for (const file of newFiles) {
        const compressedBlob = await compressImage(file)
        formData.append('newPhotos', compressedBlob, file.name)
      }

      await updateMeal(formData)
      setIsEditing(false)
      setNewFiles([])
      setNewPreviews([])
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
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 group/carousel">
        {meal.photo_urls.length > 0 ? (
          <>
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex h-full w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            >
              {meal.photo_urls.map((url, idx) => (
                <div key={idx} className="relative h-full w-full shrink-0 snap-center">
                  <img 
                    src={url} 
                    alt={`${meal.meal_type} - Foto ${idx + 1}`} 
                    className="h-full w-full object-cover" 
                  />
                </div>
              ))}
            </div>

            {/* Navegación y Contador si hay múltiples fotos */}
            {meal.photo_urls.length > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none z-10">
                  <AnimatePresence>
                    {currentImageIdx > 0 && (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={() => scrollToIndex(currentImageIdx - 1)}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 shadow-lg"
                      >
                        <ChevronLeft size={24} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none z-10">
                  <AnimatePresence>
                    {currentImageIdx < meal.photo_urls.length - 1 && (
                      <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onClick={() => scrollToIndex(currentImageIdx + 1)}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 shadow-lg"
                      >
                        <ChevronRight size={24} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contador de fotos (1/3) */}
                <div className="absolute top-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-black tracking-widest text-white backdrop-blur-md shadow-lg pointer-events-none border border-white/10">
                  {currentImageIdx + 1} / {meal.photo_urls.length}
                </div>

                {/* Puntos de Paginación */}
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-10 pointer-events-none">
                  {meal.photo_urls.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-2 rounded-full shadow-sm transition-all duration-300",
                        currentImageIdx === i ? "bg-white w-5" : "bg-white/50 w-2"
                      )} 
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm font-black uppercase tracking-widest text-zinc-300">Sin Registro Visual</span>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 pointer-events-none">
          <div className={cn(
            "flex items-center gap-1.5 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md pointer-events-auto",
            meal.meal_type === 'Actividad Física'
              ? "bg-orange-500/90 text-white dark:bg-orange-600/90"
              : "bg-white/90 text-zinc-900 dark:bg-zinc-900/90 dark:text-zinc-50"
          )}>
            {meal.meal_type === 'Actividad Física' ? <Dumbbell size={12} /> : <Utensils size={12} />}
            {meal.meal_type}
          </div>
          
          <div className="flex gap-2 pointer-events-auto">
            {isSeen && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 mt-12">
                <Check size={20} />
              </div>
            )}
            {isFavorited && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg shadow-amber-400/20 mt-12">
                <Heart size={20} fill="currentColor" />
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Calendar size={14} className={meal.meal_type === 'Actividad Física' ? 'text-orange-500' : 'text-sky-500'} />
            <span suppressHydrationWarning>
              {new Date(meal.meal_date || meal.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Action Buttons */}
          {isEditable && !isEditing && (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-transform hover:scale-110 active:scale-95 dark:bg-sky-500/10 dark:text-sky-400"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-transform hover:scale-110 active:scale-95 dark:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Agregar nuevas fotos */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Agregar Fotos</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {newPreviews.map((prev, idx) => (
                    <div key={idx} className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img src={prev} className="h-full w-full object-cover" alt="New preview" />
                      <button
                        onClick={() => removeNewImage(idx)}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-200 text-zinc-400 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-500 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    <ImagePlus size={16} />
                    <span className="text-[8px] font-bold">Subir</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>

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
                <button onClick={() => {
                  setIsEditing(false)
                  setNewFiles([])
                  setNewPreviews([])
                }} className="rounded-xl bg-zinc-100 p-2 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800">
                  <X size={20} />
                </button>
                <button onClick={handleUpdate} disabled={isUpdating} className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-black uppercase text-white shadow-lg shadow-sky-500/20 disabled:opacity-50">
                  {isUpdating ? '...' : 'Guardar'}
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
