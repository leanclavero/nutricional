'use client'

import React, { useState, useRef } from 'react'
import { Camera, X, Plus, ImageIcon } from 'lucide-react'
import { createMeal } from '@/app/patient/actions'

export function NewMealForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true)
    try {
      await createMeal(formData)
      setIsOpen(false)
      setPreview(null)
      // Reset form
    } catch (err) {
      alert('Error al guardar la comida. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <Plus size={28} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 pb-20 backdrop-blur-sm sm:items-center sm:pb-4">
      <div className="w-full max-w-md animate-in slide-in-from-bottom-5 rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Loguear Comida</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <div className="relative group">
            {preview ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
                <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm hover:bg-black/70 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 transition hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-400 dark:hover:bg-blue-500/10"
              >
                <div className="rounded-full bg-white p-4 shadow-sm dark:bg-zinc-900">
                  <Camera size={32} className="text-zinc-400 dark:text-zinc-400" />
                </div>
                <span className="text-sm font-medium">Tocar para añadir foto</span>
              </button>
            )}
            <input
              type="file"
              name="photo"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              required
            />
          </div>

          {/* Meal Details */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                ¿Qué fue esta comida?
              </label>
              <select
                name="mealType"
                required
                className="block w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              >
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Merienda">Merienda</option>
                <option value="Cena">Cena</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Comentarios
              </label>
              <textarea
                name="comments"
                rows={3}
                placeholder="Escribe algo sobre tu comida..."
                className="block w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : (
              'Guardar Comida'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
