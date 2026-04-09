'use client'

import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, Heart, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Interaction {
  type: 'like' | 'comment' | 'favorite'
  content: string | null
}

interface NutritionistInsightsProps {
  interactions: Interaction[]
}

export function NutritionistInsights({ interactions }: NutritionistInsightsProps) {
  const favorites = interactions.filter(i => i.type === 'favorite').length
  const likes = interactions.filter(i => i.type === 'like').length
  const comments = interactions.filter(i => i.type === 'comment').length

  if (interactions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-zinc-100 p-6 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm dark:bg-zinc-800">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-100">Esperando feedback</h3>
            <p className="text-xs text-zinc-500">Sigue registrando para recibir devoluciones.</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] bg-sky-500 p-6 text-white shadow-xl shadow-sky-500/20"
    >
      <div className="absolute -right-4 -top-4 opacity-10">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-sky-200" />
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-100">Insights del Profesional</span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-outfit text-lg font-bold leading-tight">
            {favorites > 0 
              ? `¡Tienes ${favorites === 1 ? 'una comida favorita' : `${favorites} favoritas`}!` 
              : comments > 0 
              ? `Tienes ${comments} ${comments === 1 ? 'nuevo comentario' : 'nuevos comentarios'}`
              : `Tu nutricionista ha visto ${likes} ${likes === 1 ? 'log' : 'logs'} hoy.`}
          </p>
          <p className="text-sm font-medium text-sky-100/80">
            {favorites > 0 ? "Vas por buen camino. ¡Sigue así!" : "Revisa el detalle de tus comidas."}
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          {favorites > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold">
              <Heart size={12} fill="currentColor" /> {favorites} Favs
            </div>
          )}
          {comments > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold">
              <MessageCircle size={12} fill="currentColor" /> {comments} Msg
            </div>
          )}
          {likes > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold">
              <CheckCircle2 size={12} /> {likes} Vistos
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
