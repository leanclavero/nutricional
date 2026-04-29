'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ClipboardList, CheckCircle2, Info, Utensils } from 'lucide-react'
import Link from 'next/link'
import { updateDailyMealsTarget } from '@/app/patient/actions'
import { useRouter } from 'next/navigation'

export default function DailyIntakesPage() {
  const [target, setTarget] = useState(4)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateDailyMealsTarget(target)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      alert('Error al guardar: ' + (error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full bg-white/70 px-6 py-4 backdrop-blur-xl dark:bg-zinc-900/70 border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <Link href="/patient" className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Ingestas Diarias
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Configura tu objetivo</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg p-6 space-y-8">
        <section className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-500 dark:bg-sky-950/30">
              <Utensils size={32} strokeWidth={2.5} />
            </div>
            <h2 className="mb-2 font-outfit text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {target} comidas al día
            </h2>
            <p className="mb-8 text-sm text-zinc-500 max-w-xs">
              Define cuántas veces quieres registrar tus ingestas hoy. Tu progreso se ajustará automáticamente.
            </p>

            <div className="w-full space-y-6">
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-100 accent-sky-500 dark:bg-zinc-800"
              />
              <div className="flex justify-between px-2 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                <span>1 comida</span>
                <span>8 comidas</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 rounded-3xl bg-sky-50/50 p-6 dark:bg-sky-950/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-500 dark:bg-sky-900/30">
              <Info size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-sky-900 dark:text-sky-400">¿Por qué configurar esto?</h4>
              <p className="mt-1 text-xs leading-relaxed text-sky-800/70 dark:text-sky-500/70">
                Cada persona tiene necesidades distintas. Ajustar tu objetivo te ayuda a mantener la constancia sin presión innecesaria.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="relative flex h-16 w-full items-center justify-center rounded-3xl bg-zinc-900 font-outfit text-lg font-black text-white transition-all active:scale-95 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {isSaving ? 'Guardando...' : 'Guardar Objetivo'}
          </button>
        </div>

        {/* Success Message Pop */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-12 left-6 right-6 z-[100] flex items-center gap-3 rounded-2xl bg-emerald-500 p-4 text-white shadow-xl shadow-emerald-500/30"
            >
              <CheckCircle2 size={20} />
              <span className="text-sm font-bold">¡Objetivo actualizado con éxito!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
