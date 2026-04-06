import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NutritionistMealCard } from './components/NutritionistMealCard'
import { logout } from '@/app/auth/actions'
import { LogOut, Users, Search } from 'lucide-react'

export default async function NutritionistPage({ searchParams }: { searchParams: { patientId?: string } }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: patients } = await supabase.from('profiles').select('id, email').eq('nutritionist_id', user.id)
  const patientIds = patients?.map((p) => p.id) || []

  let query = supabase.from('meals').select('*, patient:profiles!meals_patient_id_fkey(id, email), interactions(*)').in('patient_id', patientIds).order('created_at', { ascending: false })
  if (params.patientId) query = query.eq('patient_id', params.patientId)

  const { data: meals, error } = await query
  if (error) console.error('Error fetching meals:', error)

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Nutri-Feed <span className="font-light text-zinc-400">Pro</span></h1>
          <form action={logout}><button type="submit" className="flex items-center gap-2 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-zinc-800" title="Cerrar Sesión"><LogOut size={20} /></button></form>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200"><Users size={20} className="text-blue-500" /> Feed de Pacientes</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Monitorea los registros de tus {patients?.length || 0} pacientes.</p>
          </div>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          <a href="/nutritionist" className={`rounded-full px-4 py-2 text-xs font-semibold ${!params.patientId ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'}`}>Todos</a>
          {patients?.map((p) => (
            <a key={p.id} href={`/nutritionist?patientId=${p.id}`} className={`rounded-full px-4 py-2 text-xs font-semibold ${params.patientId === p.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'}`}>{p.email.split('@')[0]}</a>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {!meals || meals.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center text-center">
              <Search size={32} className="text-zinc-300" /><p className="mt-4 text-zinc-500 dark:text-zinc-400">No hay registros.</p>
            </div>
          ) : (
            meals.map((meal) => <NutritionistMealCard key={meal.id} meal={meal} interactions={meal.interactions} />)
          )}
        </div>
      </main>
    </div>
  )
}
