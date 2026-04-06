'use client'

import React, { useState, useRef } from 'react'
import { Camera, X, Plus } from 'lucide-react'
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
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true)
    try {
      await createMeal(formData)
      setIsOpen(false)
      setPreview(null)
    } catch (err) {
      alert('Error al guardar. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-lg transition-transform hover:scale-110">
        <Plus size={28} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 pb-20 backdrop-blur-sm sm:items-center sm:pb-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Loguear Comida</h2>
          <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={20} /></button>
        </div>
        <form action={handleSubmit} className="space-y-6">
          <div className="relative group">
            {preview ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
                <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setPreview(null)} className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition"><X size={16} /></button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 transition hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-400">
                <Camera size={32} />
                <span className="text-sm font-medium">Tocar para añadir foto</span>
              </button>
            )}
            <input type="file" name="photo" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" required />
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">¿Qué fue esta comida?</label>
              <select name="mealType" required className="block w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Merienda">Merienda</option>
                <option value="Cena">Cena</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Comentarios</label>
              <textarea name="comments" rows={3} placeholder="Escribe algo sobre tu comida..." className="block w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50" />
            </div>
          </div>
          <button type="submit" disabled={isUploading} className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50">
            {isUploading ? 'Guardando...' : 'Guardar Comida'}
          </button>
        </form>
      </div>
    </div>
  )
}
