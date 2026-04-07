'use client'

import React, { useState } from 'react'
import { UserPlus, Check, Loader2 } from 'lucide-react'
import { connectNutritionist } from '@/app/patient/actions'

export function NutritionistConnect({ currentNutriEmail }: { currentNutriEmail?: string | null }) {
  const [email, setEmail] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    try {
      await connectNutritionist(email)
      setEmail('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30">
          <UserPlus size={20} />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Mi Nutricionista</h3>
          <p className="text-xs text-zinc-500">Vincula tu cuenta para recibir feedback profesional</p>
        </div>
      </div>

      {currentNutriEmail ? (
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nutricionista Vinculado</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{currentNutriEmail}</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
            <Check size={16} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleConnect} className="space-y-3">
          <input 
            type="email" 
            placeholder="Email de tu nutricionista..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <button 
            type="submit" 
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : 'Vincular Ahora'}
          </button>
        </form>
      )}
    </div>
  )
}
