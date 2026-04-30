import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Search, ChevronRight, MessageSquare, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function PatientsListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: patients } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url')
    .eq('nutritionist_id', user.id)

  const patientIds = patients?.map(p => p.id) || []

  // Get last meal for each patient to show status
  const { data: lastMeals } = await supabase
    .from('meals')
    .select('patient_id, meal_date')
    .in('patient_id', patientIds)
    .order('meal_date', { ascending: false })

  return (
    <div className="pb-32 pt-8 px-4 max-w-lg mx-auto">
      <header className="mb-8">
        <h1 className="font-outfit text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Mis <span className="text-sky-500">Pacientes</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Gestión de panel</p>
      </header>

      {/* Search Bar Placeholder */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar paciente..." 
          className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-sm font-medium ring-1 ring-zinc-100 focus:ring-2 focus:ring-sky-500 dark:bg-zinc-900 dark:ring-white/5 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        {!patients || patients.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={48} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-sm font-medium text-zinc-400">Aún no tienes pacientes vinculados.</p>
          </div>
        ) : (
          patients.map((patient) => {
            const lastMeal = lastMeals?.find(m => m.patient_id === patient.id)
            
            return (
              <Link 
                key={patient.id} 
                href={`/nutritionist/patients/${patient.id}`}
                className="group flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 transition-all hover:scale-[1.02] hover:shadow-xl hover:ring-sky-500/30 dark:bg-zinc-900 dark:ring-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-xl font-bold text-white shadow-lg shadow-sky-500/20 uppercase">
                    {patient.email[0]}
                  </div>
                  <div>
                    <h3 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {patient.full_name || patient.email}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <Clock size={10} />
                      <span suppressHydrationWarning>
                        {lastMeal 
                          ? `Última ingesta: ${formatDistanceToNow(new Date(lastMeal.meal_date), { addSuffix: true, locale: es })}`
                          : 'Sin registros'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-300 transition-colors group-hover:bg-sky-50 group-hover:text-sky-500 dark:bg-zinc-800">
                  <ChevronRight size={20} />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
