'use client'

import React, { useState, useRef } from 'react'
import { Camera, X, Calendar, Type, CheckCircle2, ImagePlus, Plus, Dumbbell, Utensils } from 'lucide-react'
import { createMeal } from '@/app/patient/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NewMealFormProps {
  isOpen: boolean
  onClose: () => void
}

const getDefaultMealType = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 'Desayuno'
  if (hour >= 11 && hour < 16) return 'Almuerzo'
  if (hour >= 16 && hour < 20) return 'Merienda'
  return 'Cena'
}

export function NewMealForm({ isOpen, onClose }: NewMealFormProps) {
  const [entryType, setEntryType] = useState<'meal' | 'gym'>('meal')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles])
      
      selectedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string])
        reader.readAsDataURL(file)
      })
    }
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
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

  const handleClose = () => {
    setFiles([])
    setPreviews([])
    setEntryType('meal')
    onClose()
  }

  const handleSubmit = async (formData: FormData) => {
    // Para gimnasio o comida se requieren fotos por ahora, aunque el usuario dijo "sólo registrar notas",
    // si no hay fotos pero hay notas, debería dejarnos.
    const comments = formData.get('comments') as string
    if (files.length === 0 && !comments.trim()) {
      alert('Por favor agrega una foto o una nota.');
      return;
    }

    setIsUploading(true)
    try {
      const newFormData = new FormData()
      
      if (entryType === 'gym') {
        newFormData.append('mealType', 'Actividad Física')
      } else {
        newFormData.append('mealType', formData.get('mealType') as string)
      }
      
      const localDateStr = formData.get('mealDate') as string
      if (localDateStr) {
        newFormData.append('mealDate', new Date(localDateStr).toISOString())
      }
      
      newFormData.append('comments', comments)

      for (const file of files) {
        const compressedBlob = await compressImage(file)
        newFormData.append('photos', compressedBlob, file.name)
      }
      
      await createMeal(newFormData)
      handleClose()
    } catch (err) {
      console.error(err)
      alert('Error al guardar. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div>
                <h2 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                  Nuevo Registro
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Elige qué deseas guardar
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-6">
              {/* Type Selector Toggle */}
              <div className="mb-6 flex rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setEntryType('meal')}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black uppercase tracking-widest transition-all",
                    entryType === 'meal' 
                      ? "bg-white text-sky-600 shadow-sm dark:bg-zinc-900 dark:text-sky-400" 
                      : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  )}
                >
                  <Utensils size={14} /> Comida
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('gym')}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black uppercase tracking-widest transition-all",
                    entryType === 'gym' 
                      ? "bg-white text-orange-500 shadow-sm dark:bg-zinc-900 dark:text-orange-400" 
                      : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  )}
                >
                  <Dumbbell size={14} /> Gimnasio
                </button>
              </div>

              <form action={handleSubmit} className="space-y-4">
                {/* Image Upload Area */}
                <div className="relative">
                  {previews.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                      {previews.map((prev, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative h-24 w-24 shrink-0 snap-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
                        >
                          <img src={prev} alt={`Vista previa ${idx}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex h-24 w-24 shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 transition-all hover:border-sky-400 hover:bg-sky-50 dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <Plus size={20} className={entryType === 'gym' ? 'text-orange-500' : 'text-sky-500'} />
                        <span className="text-[10px] font-bold">Agregar</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className={cn(
                          "flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-zinc-50 transition-all dark:bg-zinc-950",
                          entryType === 'gym' ? "border-orange-100 text-orange-400 hover:border-orange-400 hover:bg-orange-50 dark:border-zinc-800" : "border-zinc-200 text-zinc-400 hover:border-sky-400 hover:bg-sky-50 dark:border-zinc-800"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                          <Camera size={20} className={entryType === 'gym' ? 'text-orange-500' : 'text-sky-500'} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Cámara</p>
                          <p className="text-[10px] text-zinc-400 mt-1">Tomar una foto</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className={cn(
                          "flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-zinc-50 transition-all dark:bg-zinc-950",
                          entryType === 'gym' ? "border-orange-100 text-orange-400 hover:border-orange-400 hover:bg-orange-50 dark:border-zinc-800" : "border-zinc-200 text-zinc-400 hover:border-sky-400 hover:bg-sky-50 dark:border-zinc-800"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                          <ImagePlus size={20} className={entryType === 'gym' ? 'text-orange-500' : 'text-sky-500'} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Galería</p>
                          <p className="text-[10px] text-zinc-400 mt-1">Elegir imágenes</p>
                        </div>
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    capture="environment"
                    multiple
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    {entryType === 'meal' ? (
                      <>
                        <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">
                          <CheckCircle2 size={10} className="text-sky-500" /> Momento
                        </label>
                        <select
                          name="mealType"
                          required
                          defaultValue={getDefaultMealType()}
                          className="w-full rounded-xl border-none bg-zinc-50 px-3 py-2.5 text-xs font-bold ring-1 ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
                        >
                          <option value="Desayuno">Desayuno</option>
                          <option value="Almuerzo">Almuerzo</option>
                          <option value="Merienda">Merienda</option>
                          <option value="Cena">Cena</option>
                          <option value="Snack">Snack</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">
                          <Dumbbell size={10} className="text-orange-500" /> Tipo
                        </label>
                        <div className="w-full rounded-xl bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                          Actividad Física
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">
                      <Calendar size={10} className={entryType === 'gym' ? 'text-orange-500' : 'text-sky-500'} /> Fecha y Hora
                    </label>
                    <input
                      type="datetime-local"
                      name="mealDate"
                      defaultValue={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                      required
                      className={cn(
                        "w-full rounded-xl border-none bg-zinc-50 px-3 py-2.5 text-xs font-bold ring-1 ring-zinc-200 focus:bg-white focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800",
                        entryType === 'gym' ? "focus:ring-orange-500" : "focus:ring-sky-500"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">
                    <Type size={10} className={entryType === 'gym' ? 'text-orange-500' : 'text-sky-500'} /> Notas (opcional)
                  </label>
                  <textarea
                    name="comments"
                    rows={2}
                    placeholder={entryType === 'gym' ? "Ej: 45 min de pesas y 15 de cardio..." : "Ej: Pollo con ensalada y palta..."}
                    className={cn(
                      "w-full resize-none rounded-xl border-none bg-zinc-50 px-3 py-2.5 text-xs font-medium ring-1 ring-zinc-200 focus:bg-white focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800",
                      entryType === 'gym' ? "focus:ring-orange-500" : "focus:ring-sky-500"
                    )}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className={cn(
                    "relative flex w-full items-center justify-center overflow-hidden rounded-2xl py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg transition disabled:opacity-50",
                    entryType === 'gym' ? "bg-orange-500 shadow-orange-500/20 hover:bg-orange-600" : "bg-sky-500 shadow-sky-500/20 hover:bg-sky-600"
                  )}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="relative z-10">
                    {isUploading ? 'Procesando...' : (entryType === 'gym' ? 'Guardar Actividad' : 'Guardar Comida')}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
