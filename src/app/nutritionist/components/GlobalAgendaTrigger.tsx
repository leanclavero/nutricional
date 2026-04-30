'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { NewAppointmentModal } from './NewAppointmentModal'

interface GlobalAgendaTriggerProps {
  patients: { id: string, name: string }[]
}

export function GlobalAgendaTrigger({ patients }: GlobalAgendaTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 transition-transform active:scale-90"
        title="Nuevo Turno"
      >
        <Plus size={16} />
      </button>

      <NewAppointmentModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        patients={patients} 
      />
    </>
  )
}
