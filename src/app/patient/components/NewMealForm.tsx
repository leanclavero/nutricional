'use client'

import React, { useState, useRef } from 'react'
import { Camera, X, Calendar, Type, CheckCircle2 } from 'lucide-react'
import { createMeal } from '@/app/patient/actions'
import { motion, AnimatePresence } from 'framer-motion'

interface NewMealFormProps {
  isOpen: boolean
  onClose: () => void
}

export function NewMealForm({ isOpen, onClose }: NewMealFormProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
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
    setPreview(null)
    onClose()
  }

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true)
    try {
      const photo = formData.get('photo') as File
      if (photo && photo.size > 0) {
        const compressedBlob = await compressImage(photo)
        formData.set('photo', compressedBlob, 'meal.jpg')
      }
      await createMeal(formData)
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
                  Registrar Comida
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Captura tu momento nutricional
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
              <form action={handleSubmit} className="space-y-4">
                {/* Image Upload Area */}
                <div className="relative">
                  {preview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
                    >
                      <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPreview(null)}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 transition-all hover:border-sky-400 hover:bg-sky-50 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                        <Camera size={24} className="text-sky-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Tocar para fotografiar</p>
                        <p className="text-[10px] text-zinc-400">La foto es clave para tu nutricionista</p>
                      </div>
                    </button>
                  )}
                  <input
                    type="file"
                    name="photo"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    required
                  />
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">
                      <CheckCircle2 size={10} className="text-sky-500" /> Momento
                    </label>
                    <select
                      name="mealType"
                      required
                      className="w-full rounded-xl border-none bg-zinc-50 px-3 py-2.5 text-xs font-bold ring-1 ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
                    >
                      <option value="Desayuno">Desayuno</option>
                      <option value="Almuerzo">Almuerzo</option>
                      <option value="Merienda">Merienda</option>
                      <option value="Cena">Cena</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">
                      <Calendar size={10} className="text-sky-500" /> Fecha y Hora
                    </label>
                    <input
                      type="datetime-local"
                      name="mealDate"
                      defaultValue={new Date().toISOString().slice(0, 16)}
                      required
                      className="w-full rounded-xl border-none bg-zinc-50 px-3 py-2.5 text-xs font-bold ring-1 ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">
                    <Type size={10} className="text-sky-500" /> Notas (opcional)
                  </label>
                  <textarea
                    name="comments"
                    rows={2}
                    placeholder="Ej: Pollo con ensalada y palta..."
                    className="w-full resize-none rounded-xl border-none bg-zinc-50 px-3 py-2.5 text-xs font-medium ring-1 ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-sky-500 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 disabled:opacity-50"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="relative z-10">
                    {isUploading ? 'Procesando...' : 'Guardar Comida'}
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
