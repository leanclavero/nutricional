import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Clock, Plus } from 'lucide-react'

export default async function NutritionistAppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="pb-32 pt-8 px-4 max-w-lg mx-auto">
      <header className="mb-8">
        <h1 className="font-outfit text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Mis <span className="text-sky-500">Turnos</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Calendario profesional</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2.5rem] bg-white shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-500 mb-6 dark:bg-sky-500/10">
          <Calendar size={32} />
        </div>
        <h3 className="font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">Próximamente</h3>
        <p className="mt-2 text-sm text-zinc-500 px-10">La gestión de agenda estará disponible pronto.</p>
        
        <button className="mt-8 flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-xs font-black uppercase text-white shadow-lg shadow-sky-500/20">
          <Plus size={16} />
          Nuevo Turno
        </button>
      </div>
    </div>
  )
}
