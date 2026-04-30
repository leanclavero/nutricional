'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, Flame, TrendingUp, User, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RegistrationHeatmap } from '@/app/patient/components/RegistrationHeatmap'
import { NutritionistHistoryView } from './NutritionistHistoryView'

interface PatientProfileSectionsProps {
  meals: any[]
  patient: any
  heatmapData: any[]
  currentUserId: string
}

export function PatientProfileSections({ meals, patient, heatmapData, currentUserId }: PatientProfileSectionsProps) {
  const [activeTab, setActiveTab] = useState<'registro' | 'heatmap' | 'evolucion' | 'perfil'>('registro')

  const tabs = [
    { id: 'registro', label: 'Registro', icon: LayoutGrid },
    { id: 'heatmap', label: 'Heatmap', icon: Flame },
    { id: 'evolucion', label: 'Evolución', icon: TrendingUp },
    { id: 'perfil', label: 'Perfil', icon: User },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
                  : "bg-white text-zinc-400 hover:text-zinc-600 dark:bg-zinc-900 dark:text-zinc-500"
              )}
            >
              <Icon size={14} strokeWidth={isActive ? 3 : 2} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'registro' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/10">
                  <Clock size={16} />
                </div>
                <h2 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">Registro Fotográfico</h2>
              </div>
              <NutritionistHistoryView meals={meals} currentUserId={currentUserId} />
            </div>
          )}

          {activeTab === 'heatmap' && (
            <div className="rounded-[2.5rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                  <Flame size={16} />
                </div>
                <h2 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">Mapa de Calor</h2>
              </div>
              <RegistrationHeatmap data={heatmapData} />
            </div>
          )}

          {activeTab === 'evolucion' && (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2.5rem] bg-white shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500 mb-6 dark:bg-indigo-500/10">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">Próximamente</h3>
              <p className="mt-2 text-sm text-zinc-500 px-10">Gráficos de peso y métricas corporales.</p>
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50 text-zinc-300 mb-4 dark:bg-zinc-800">
                  <User size={32} />
                </div>
                <h3 className="font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {patient.full_name || 'Paciente Sin Nombre'}
                </h3>
                <p className="text-sm text-zinc-500">{patient.email}</p>
                <div className="mt-6 w-full space-y-3 border-t border-zinc-50 pt-6 dark:border-white/5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <span>ID</span>
                    <span className="text-zinc-900 dark:text-zinc-50">{patient.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
