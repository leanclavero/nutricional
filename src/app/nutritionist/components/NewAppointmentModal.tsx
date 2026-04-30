'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react'
import { createAppointment } from '../actions'
import { cn } from '@/lib/utils'

interface NewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  patients: { id: string, name: string }[]
  initialPatientId?: string
}

export function NewAppointmentModal({ isOpen, onClose, patients, initialPatientId }: NewAppointmentModalProps) {
  const [patientId, setPatientId] = useState(initialPatientId || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('Control Mensual')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId || !date || !time) return

    setIsSubmitting(true)
    try {
      const fullDate = `${date}T${time}:00`
      await createAppointment({
        patientId,
        date: fullDate,
        type,
        notes
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      console.error(err)
      alert('Error al crear el turno. Verifica que la tabla "appointments" existe.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-zinc-900"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="font-outfit text-2xl font-black text-zinc-900 dark:text-zinc-50">¡Turno Creado!</h2>
                <p className="mt-2 text-sm text-zinc-500">El paciente recibirá una notificación pronto.</p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="font-outfit text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Nuevo Turno</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Agendar cita clínica</p>
                  </div>
                  <button onClick={onClose} className="rounded-full bg-zinc-50 p-2 text-zinc-400 dark:bg-zinc-800">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient Selector */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                      <User size={12} /> Paciente
                    </label>
                    <select
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      required
                      className="w-full rounded-2xl border-none bg-zinc-50 p-4 text-sm font-bold outline-none ring-1 ring-zinc-100 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-800 dark:ring-white/5"
                    >
                      <option value="">Seleccionar paciente...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                        <Calendar size={12} /> Fecha
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full rounded-2xl border-none bg-zinc-50 p-4 text-sm font-bold outline-none ring-1 ring-zinc-100 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-800 dark:ring-white/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                        <Clock size={12} /> Hora
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="w-full rounded-2xl border-none bg-zinc-50 p-4 text-sm font-bold outline-none ring-1 ring-zinc-100 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-800 dark:ring-white/5"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                      <FileText size={12} /> Tipo de Consulta
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Primera Consulta', 'Control Mensual', 'Seguimiento', 'Urgencia'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={cn(
                            "rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                            type === t 
                              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
                              : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
                      Notas (Opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Observaciones para la consulta..."
                      className="h-24 w-full rounded-2xl border-none bg-zinc-50 p-4 text-sm font-medium outline-none ring-1 ring-zinc-100 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-800 dark:ring-white/5"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-sky-500 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Agendando...' : 'Confirmar Turno'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
