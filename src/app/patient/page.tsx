import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MealCard } from './components/MealCard'
import { NewMealForm } from './components/NewMealForm'
import { logout } from '@/app/auth/actions'
import { LogOut, Calendar } from 'lucide-react'
import { NutritionistConnect } from './components/NutritionistConnect'

export default async function PatientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meals, error } = await supabase.from('meals').select('*, interactions(*)').eq('patient_id', user.id).order('meal_date', { ascending: false })
  if (error) console.error('Error fetching meals:', error)

  const currentUserId = user.id

  const { data: profile } = await supabase.from('profiles').select('nutritionist_id').eq('id', user.id).single()
  let nutritionistEmail = null
  if (profile?.nutritionist_id) {
    const { data: nutri } = await supabase.from('profiles').select('email').eq('id', profile.nutritionist_id).single()
    nutritionistEmail = nutri?.email
  }

  const isWithin24Hours = (date: string) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    return diff < 24
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Nutri-Feed</h1>
          <form action={logout}><button type="submit" className="flex items-center gap-2 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-zinc-800" title="Cerrar Sesión"><LogOut size={20} /></button></form>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-6 py-8">
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200"><Calendar size={20} className="text-blue-500" /> Mi Diario de Comidas</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Registra tus fotos y recibe feedback de tu nutricionista.</p>
        </div>
        <div className="flex flex-col gap-6">
          {!meals || meals.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"><Calendar size={32} className="text-zinc-300" /></div>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400">Aún no has registrado ninguna comida hoy.</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Toca el botón "+" para empezar.</p>
            </div>
          ) : (
            meals.map((meal) => <MealCard key={meal.id} meal={meal} isEditable={isWithin24Hours(meal.meal_date || meal.created_at)} currentUserId={currentUserId} />)
          )}
        </div>
        
        <NutritionistConnect currentNutriEmail={nutritionistEmail} />
      </main>
      <NewMealForm />
    </div>
  )
}
