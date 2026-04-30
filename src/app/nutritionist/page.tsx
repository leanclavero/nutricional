import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NutritionistMealCard } from './components/NutritionistMealCard'
import { logout } from '@/app/auth/actions'
import { LogOut, Users, Search, Activity, MessageSquare, Heart } from 'lucide-react'
import { PatientList } from './components/PatientList'
import { FilterTabs } from './components/FilterTabs'
import { NutritionistFeed } from './components/NutritionistFeed'
import Link from 'next/link'

export default async function NutritionistPage({ searchParams }: { searchParams: { patientId?: string, filter?: 'vistos' | 'pendientes' | 'favoritos' } }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase.from('notifications').select('id').eq('user_id', user.id).eq('is_read', false)
  const { data: patients } = await supabase.from('profiles').select('id, email').eq('nutritionist_id', user.id)
  const patientIds = patients?.map((p) => p.id) || []

  // Optimize stats: only fetch meals from last 15 days for the sidebar counts
  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

  const { data: mealsData } = await supabase
    .from('meals')
    .select('id, patient_id, meal_date, interactions(type)')
    .in('patient_id', patientIds)
    .gt('meal_date', fifteenDaysAgo.toISOString())

  // Efficiently group meals by patient
  const mealsByPatient: Record<string, any[]> = {}
  mealsData?.forEach((m: any) => {
    if (!mealsByPatient[m.patient_id]) mealsByPatient[m.patient_id] = []
    mealsByPatient[m.patient_id].push(m)
  })

  const patientStats = patientIds.map(pid => {
    const pMeals = mealsByPatient[pid] || []
    // A meal is pending if it DOES NOT have a 'like' (visto) from the nutritionist
    const pendingCount = pMeals.filter(m => !m.interactions.some((i: any) => i.type === 'like')).length
    const lastMeal = pMeals.length > 0 
      ? pMeals.reduce((prev, curr) => new Date(curr.meal_date) > new Date(prev.meal_date) ? curr : prev).meal_date
      : null
    
    return {
      id: pid,
      email: patients?.find(p => p.id === pid)?.email || '',
      last_meal_date: lastMeal,
      pending_feedback_count: pendingCount
    }
  })

  const totalPending = patientStats.reduce((acc, curr) => acc + curr.pending_feedback_count, 0)

  let query = supabase
    .from('meals')
    .select('*, patient:profiles!meals_patient_id_fkey(id, email), interactions(*)')
    .in('patient_id', patientIds)
    .order('meal_date', { ascending: false })
    .limit(50) // Pagination: Only show top 50
  if (params.patientId) query = query.eq('patient_id', params.patientId)

  const { data: meals, error } = await query
  if (error) console.error('Error fetching meals:', error)

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Nutri-Feed <span className="font-light text-zinc-400">Pro</span></h1>
            {notifications && notifications.length > 0 && (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MessageSquare size={18} />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {notifications.length}
                </span>
              </div>
            )}
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/nutritionist" className="text-sm font-bold text-sky-500">Feed</Link>
            <Link href="/nutritionist/patients" className="text-sm font-bold text-zinc-500 hover:text-sky-500 transition-colors">Pacientes</Link>
            <Link href="/nutritionist/appointments" className="text-sm font-bold text-zinc-500 hover:text-sky-500 transition-colors">Turnos</Link>
            <Link href="/nutritionist/profile" className="text-sm font-bold text-zinc-500 hover:text-sky-500 transition-colors">Perfil</Link>
          </nav>
          <div className="flex items-center gap-4">
            <form action={logout}><button type="submit" className="flex items-center gap-2 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-zinc-800" title="Cerrar Sesión"><LogOut size={20} /></button></form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Dashboard Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/10">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400"><Users size={16} /><span className="text-[10px] font-bold uppercase tracking-wider">Pacientes</span></div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{patients?.length || 0}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/10">
            <div className="flex items-center gap-2 text-blue-500"><MessageSquare size={16} /><span className="text-[10px] font-bold uppercase tracking-wider">Pendientes</span></div>
            <p className="mt-1 text-2xl font-bold text-blue-600">{totalPending}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/10">
            <div className="flex items-center gap-2 text-emerald-500"><Activity size={16} /><span className="text-[10px] font-bold uppercase tracking-wider">Registros Hoy</span></div>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {mealsData?.filter(m => new Date(m.meal_date).toDateString() === new Date().toDateString()).length || 0}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/10">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400"><Heart size={16} /><span className="text-[10px] font-bold uppercase tracking-wider">Mi Email</span></div>
            <p className="mt-2 text-[10px] font-medium text-zinc-400 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="w-full lg:w-80">
            <div className="sticky top-24">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Panel de Pacientes</h3>
              <PatientList 
                patients={patientStats} 
                selectedId={params.patientId} 
              />
            </div>
          </aside>

          <NutritionistFeed 
            initialMeals={meals || []} 
            currentUserId={user.id} 
            patientId={params.patientId}
            initialFilter={params.filter}
            patients={patients || []}
          />
        </div>
      </main>
    </div>
  )
}
