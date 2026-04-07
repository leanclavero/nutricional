import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NutritionistMealCard } from './components/NutritionistMealCard'
import { logout } from '@/app/auth/actions'
import { LogOut, Users, Search, Activity, MessageSquare, Heart } from 'lucide-react'
import { PatientList } from './components/PatientList'

export default async function NutritionistPage({ searchParams }: { searchParams: { patientId?: string, filter?: 'vistos' | 'pendientes' | 'favoritos' } }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase.from('notifications').select('id').eq('user_id', user.id).eq('is_read', false)
  const { data: patients } = await supabase.from('profiles').select('id, email').eq('nutritionist_id', user.id)
  const patientIds = patients?.map((p) => p.id) || []

  // Fetch meals with interactions to calculate stats
  const { data: mealsData } = await supabase
    .from('meals')
    .select('id, patient_id, meal_date, interactions(type)')
    .in('patient_id', patientIds)

  const patientStats = patientIds.map(pid => {
    const patientMeals = mealsData?.filter(m => m.patient_id === pid) || []
    const pendingCount = patientMeals.filter(m => !m.interactions.some((i: any) => i.type === 'comment')).length
    const lastMeal = patientMeals.length > 0 
      ? patientMeals.sort((a, b) => new Date(b.meal_date).getTime() - new Date(a.meal_date).getTime())[0].meal_date 
      : null
    
    return {
      id: pid,
      email: patients?.find(p => p.id === pid)?.email || '',
      last_meal_date: lastMeal,
      pending_feedback_count: pendingCount
    }
  })

  const totalPending = patientStats.reduce((acc, curr) => acc + curr.pending_feedback_count, 0)

  let query = supabase.from('meals').select('*, patient:profiles!meals_patient_id_fkey(id, email), interactions(*)').in('patient_id', patientIds).order('meal_date', { ascending: false })
  if (params.patientId) query = query.eq('patient_id', params.patientId)

  const { data: meals, error } = await query
  if (error) console.error('Error fetching meals:', error)

  let filteredMeals = meals || []
  if (params.filter === 'pendientes') {
    filteredMeals = filteredMeals.filter(m => !m.interactions.some((i: any) => i.type === 'like' && i.user_id === user.id))
  } else if (params.filter === 'vistos') {
    filteredMeals = filteredMeals.filter(m => m.interactions.some((i: any) => i.type === 'like' && i.user_id === user.id))
  } else if (params.filter === 'favoritos') {
    filteredMeals = filteredMeals.filter(m => m.interactions.some((i: any) => i.type === 'favorite' && i.user_id === user.id))
  }

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
          <form action={logout}><button type="submit" className="flex items-center gap-2 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-zinc-800" title="Cerrar Sesión"><LogOut size={20} /></button></form>
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

          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {params.patientId 
                  ? `Diario: ${patients?.find(p => p.id === params.patientId)?.email.split('@')[0]}`
                  : 'Feed de Actividad Global'
                }
              </h2>
              
              <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
                <a href={`/nutritionist${params.patientId ? `?patientId=${params.patientId}` : ''}`} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${!params.filter ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>Todos</a>
                <a href={`/nutritionist?filter=pendientes${params.patientId ? `&patientId=${params.patientId}` : ''}`} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${params.filter === 'pendientes' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>No Vistos</a>
                <a href={`/nutritionist?filter=vistos${params.patientId ? `&patientId=${params.patientId}` : ''}`} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${params.filter === 'vistos' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>Vistos</a>
                <a href={`/nutritionist?filter=favoritos${params.patientId ? `&patientId=${params.patientId}` : ''}`} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${params.filter === 'favoritos' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>Favoritos</a>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {!filteredMeals || filteredMeals.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center text-center text-zinc-500">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"><Search size={24} className="text-zinc-300" /></div>
                  <p className="mt-4">No hay resultados para este filtro.</p>
                </div>
              ) : (
                filteredMeals.map((meal) => <NutritionistMealCard key={meal.id} meal={meal} interactions={meal.interactions} currentUserId={user.id} />)
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
