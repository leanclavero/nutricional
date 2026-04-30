import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '../components/PageHeader'
import { Calendar, Clock, MapPin, User, Video, Info } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, nutritionist:profiles!appointments_nutritionist_id_fkey(full_name, email)')
    .eq('patient_id', user.id)
    .order('appointment_date', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
      <PageHeader title="Mis Turnos" subtitle="Agenda de citas clínicas" />
      
      <main className="mx-auto max-w-lg px-4 pt-4 space-y-4">
        {!appointments || appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50 text-zinc-300 dark:bg-zinc-800">
              <Calendar size={32} />
            </div>
            <h3 className="mt-6 font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">Sin turnos agendados</h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 px-10">Cuando tu nutricionista agende una cita, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 transition-all hover:shadow-xl dark:bg-zinc-900 dark:ring-white/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 dark:bg-sky-500/10">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
                        {format(new Date(app.appointment_date), "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                      <h3 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {app.type}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-zinc-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800">
                    <Clock size={10} />
                    {format(new Date(app.appointment_date), 'HH:mm')}
                  </div>
                </div>

                <div className="space-y-3 border-t border-zinc-50 pt-4 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 dark:bg-zinc-800">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Profesional</p>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {app.nutritionist?.full_name || app.nutritionist?.email || 'Tu Nutricionista'}
                      </p>
                    </div>
                  </div>

                  {app.notes && (
                    <div className="flex items-start gap-3 rounded-2xl bg-zinc-50/50 p-3 dark:bg-zinc-800/30">
                      <Info size={14} className="mt-0.5 text-sky-500" />
                      <p className="text-[11px] font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {app.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-50 py-3 text-[10px] font-black uppercase tracking-widest text-sky-600 transition-colors hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400">
                    <Video size={14} />
                    Videollamada
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-50 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:bg-zinc-100 dark:bg-zinc-800">
                    Cómo llegar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
