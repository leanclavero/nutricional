'use client'

import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import { NewAppointmentModal } from './NewAppointmentModal'

interface PatientAgendaTriggerProps {
  patient: { id: string, name: string }
}

export function PatientAgendaTrigger({ patient }: PatientAgendaTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-sky-500/20 transition-transform active:scale-95"
      >
        <Calendar size={16} />
        Agendar
      </button>

      <NewAppointmentModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        patients={[patient]} 
        initialPatientId={patient.id} 
      />
    </>
  )
}
