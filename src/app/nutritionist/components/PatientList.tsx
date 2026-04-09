'use client'

import React from 'react'
import { User, Calendar, MessageSquare, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface Patient {
  id: string
  email: string
  last_meal_date?: string | null
  pending_feedback_count: number
}

export function PatientList({ patients, selectedId }: { patients: Patient[], selectedId?: string | null }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const handleSelect = (id: string | null) => {
    startTransition(() => {
      router.push(id ? `/nutritionist?patientId=${id}` : '/nutritionist')
    })
  }

  return (
    <div className={`space-y-3 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      <button
        onClick={() => handleSelect(null)}
        className={`group flex w-full items-center justify-between overflow-hidden rounded-2xl p-4 transition-all ${
          !selectedId 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-500' 
            : 'bg-white shadow-sm ring-1 ring-zinc-100 hover:shadow-md dark:bg-zinc-900 dark:ring-white/10'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${!selectedId ? 'bg-white/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'}`}>
            <User size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold">Todos los pacientes</p>
            <p className={`text-[10px] ${!selectedId ? 'text-blue-100' : 'text-zinc-500'}`}>Vista global del feed</p>
          </div>
        </div>
        <ChevronRight size={20} className={!selectedId ? 'text-white' : 'text-zinc-300'} />
      </button>

      {patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 p-10 text-center dark:border-white/5">
          <User className="mb-2 text-zinc-300" size={32} />
          <p className="text-sm text-zinc-500">Aún no tienes pacientes vinculados.</p>
        </div>
      ) : (
        patients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => handleSelect(patient.id)}
            className={`group flex w-full items-center justify-between overflow-hidden rounded-2xl p-4 transition-all ${
              selectedId === patient.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-500' 
                : 'bg-white shadow-sm ring-1 ring-zinc-100 hover:shadow-md dark:bg-zinc-900 dark:ring-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${selectedId === patient.id ? 'bg-white/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'}`}>
                <span className="font-bold">{patient.email[0].toUpperCase()}</span>
              </div>
              <div className="text-left">
                <p className="font-bold">{patient.email}</p>
                <div className={`mt-1 flex items-center gap-3 text-[10px] ${selectedId === patient.id ? 'text-blue-100' : 'text-zinc-500'}`}>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {patient.last_meal_date 
                      ? `${formatDistanceToNow(new Date(patient.last_meal_date), { locale: es })}`
                      : 'Sin actividad'
                    }
                  </span>
                  {patient.pending_feedback_count > 0 && (
                    <span className={`flex items-center gap-1 font-bold ${selectedId === patient.id ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                      <MessageSquare size={10} />
                      {patient.pending_feedback_count} pend.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight size={20} className={selectedId === patient.id ? 'text-white' : 'text-zinc-300'} />
          </button>
        ))
      )}
    </div>
  )
}
