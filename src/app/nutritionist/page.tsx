import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/auth/actions'
import { LogOut, Users, MessageSquare, Calendar, AlertCircle, Clock, ChevronRight, Plus } from 'lucide-react'
import { NutritionistFeed } from './components/NutritionistFeed'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { GlobalAgendaTrigger } from './components/GlobalAgendaTrigger'

export default async function NutritionistPage({ searchParams }: { searchParams: { filter?: 'vistos' | 'pendientes' | 'favoritos' } }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: patients } = await supabase.from('profiles').select('id, email, full_name').eq('nutritionist_id', user.id)
  const patientIds = patients?.map((p) => p.id) || []

  // Fetch meals for stats and alerts
  const { data: mealsData } = await supabase
    .from('meals')
    .select('id, patient_id, meal_date, interactions(type)')
    .in('patient_id', patientIds)
    .order('meal_date', { ascending: false })

  const patientStats = patientIds.map(pid => {
    const pMeals = mealsData?.filter(m => m.patient_id === pid) || []
    const pendingCount = pMeals.filter(m => !m.interactions.some((i: any) => i.type === 'like')).length
    const lastMeal = pMeals.length > 0 ? pMeals[0].meal_date : null
    
    const patientData = patients?.find(p => p.id === pid)
    return {
      id: pid,
      email: patientData?.email || '',
      name: patientData?.full_name || patientData?.email || 'Paciente',
      last_meal_date: lastMeal,
      pending_feedback_count: pendingCount
    }
  })

  const inactivePatients = patientStats.filter(p => {
    if (!p.last_meal_date) return true
    const diffHours = (new Date().getTime() - new Date(p.last_meal_date).getTime()) / (1000 * 60 * 60)
    return diffHours > 48
  })

  // Fetch real appointments for today
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const { data: todayAppointments } = await supabase
    .from('appointments')
    .select('*, patient:profiles!appointments_patient_id_fkey(full_name, email)')
    .eq('nutritionist_id', user.id)
    .gte('appointment_date', startOfToday.toISOString())
    .lte('appointment_date', endOfToday.toISOString())
    .order('appointment_date', { ascending: true })

  // Fetch meals for the feed
  let query = supabase
    .from('meals')
    .select('*, patient:profiles!meals_patient_id_fkey(id, email), interactions(*)')
    .in('patient_id', patientIds)
    .order('meal_date', { ascending: false })
    .limit(30)

  const { data: meals } = await query

  return (
    <div className="min-h-screen bg-zinc-50 pb-32 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Nutri-<span className="text-sky-500">Feed</span> <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Pro</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/nutritionist" className="text-xs font-black uppercase tracking-widest text-sky-500">Panel</Link>
            <Link href="/nutritionist/patients" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-sky-500 transition-colors">Pacientes</Link>
            <Link href="/nutritionist/appointments" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-sky-500 transition-colors">Turnos</Link>
          </nav>
          <form action={logout}>
            <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all dark:bg-zinc-800">
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        
        {/* Alerts Section */}
        {inactivePatients.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2 text-red-500">
              <AlertCircle size={18} />
              <h2 className="text-xs font-black uppercase tracking-widest">Alertas de Inactividad</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {inactivePatients.map(p => (
                <Link 
                  key={p.id} 
                  href={`/nutritionist/patients/${p.id}`}
                  className="flex shrink-0 w-64 items-center gap-4 rounded-3xl bg-red-50 p-4 ring-1 ring-red-100 transition-transform hover:scale-[1.02] dark:bg-red-950/20 dark:ring-red-900/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 uppercase">
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-red-900 dark:text-red-200 truncate">{p.name}</p>
                    <p className="text-[10px] font-medium text-red-600 dark:text-red-400">Sin registros hace 48h+</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Agenda */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-sky-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Agenda de Hoy</h2>
              </div>
              <GlobalAgendaTrigger patients={patients?.map(p => ({ id: p.id, name: p.full_name || p.email })) || []} />
            </div>

            <div className="space-y-3">
              {!todayAppointments || todayAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center rounded-3xl border-2 border-dashed border-zinc-100 dark:border-white/5">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No hay turnos hoy</p>
                </div>
              ) : (
                todayAppointments.map(app => (
                  <div key={app.id} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10">
                        <span className="text-[10px] font-black">{format(new Date(app.appointment_date), 'HH:mm')}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{app.type}</p>
                        <p className="text-[10px] font-medium text-zinc-400">{app.patient?.full_name || app.patient?.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              <Link href="/nutritionist/appointments" className="flex items-center justify-center p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-sky-500 transition-colors">
                Ver agenda completa <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Right Column: Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-emerald-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Actividad Reciente</h2>
              </div>
            </div>

            <NutritionistFeed 
              initialMeals={meals || []} 
              currentUserId={user.id} 
              patients={patients || []}
            />
          </div>

        </div>
      </main>
    </div>
  )
}
