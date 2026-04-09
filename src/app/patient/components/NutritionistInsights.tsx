'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, MessageCircle, CheckCircle2, X } from 'lucide-react'

interface Interaction {
  type: 'like' | 'comment' | 'favorite'
  content: string | null
}

interface NutritionistInsightsProps {
  interactions: Interaction[]
}

export function NutritionistInsights({ interactions }: NutritionistInsightsProps) {
  const [dismissed, setDismissed] = useState(false)

  const favorites = interactions.filter(i => i.type === 'favorite').length
  const likes = interactions.filter(i => i.type === 'like').length
  const comments = interactions.filter(i => i.type === 'comment').length

  if (dismissed || interactions.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        className="relative overflow-hidden rounded-2xl bg-sky-500 p-4 text-white shadow-lg shadow-sky-500/20"
      >
        {/* Decorative */}
        <div className="absolute -right-3 -top-3 opacity-10">
          <Sparkles size={80} />
        </div>

        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white/80 transition hover:bg-white/30 hover:text-white"
          aria-label="Cerrar"
        >
          <X size={14} />
        </button>

        <div className="relative z-10 pr-6">
          {/* Title */}
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles size={13} className="text-sky-200" />
            <span className="text-[9px] font-black uppercase tracking-widest text-sky-100">
              Feedback de tu nutricionista
            </span>
          </div>

          {/* Main message */}
          <p className="font-outfit text-sm font-bold leading-snug">
            {favorites > 0
              ? `¡${favorites === 1 ? 'Una comida marcada' : `${favorites} comidas marcadas`} como favorita${favorites > 1 ? 's' : ''}! 🌟`
              : comments > 0
              ? `Tienes ${comments} ${comments === 1 ? 'comentario nuevo' : 'comentarios nuevos'} 💬`
              : `Tu nutricionista revisó ${likes} ${likes === 1 ? 'registro' : 'registros'} ✓`}
          </p>
          <p className="mt-0.5 text-xs text-sky-100/80">
            {favorites > 0 ? 'Vas por buen camino. ¡Seguí así!' : 'Revisá el detalle en cada comida.'}
          </p>

          {/* Badges */}
          <div className="mt-3 flex gap-2">
            {favorites > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">
                <Heart size={10} fill="currentColor" /> {favorites} Fav{favorites > 1 ? 's' : ''}
              </div>
            )}
            {comments > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">
                <MessageCircle size={10} /> {comments} Msg
              </div>
            )}
            {likes > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">
                <CheckCircle2 size={10} /> {likes} Visto{likes > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
