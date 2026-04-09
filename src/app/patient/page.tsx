import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MealCard } from './components/MealCard'
import { NewMealForm } from './components/NewMealForm'
import { logout } from '@/app/auth/actions'
import { LogOut, Calendar, Plus } from 'lucide-react'
import { NutritionistConnect } from './components/NutritionistConnect'
import { DailyProgressBar } from './components/DailyProgressBar'
import { NutritionistInsights } from './components/NutritionistInsights'
import { HistoryLink } from './components/HistoryLink'
import * as motion from 'framer-motion/client'

export default async function PatientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  // Fetch only today's meals for the main view
  const { data: todayMeals, error: mealsError } = await supabase.from('meals')
    .select('*, interactions(*)')
    .eq('patient_id', user.id)
    .gte('meal_date', startOfToday.toISOString())
    .order('meal_date', { ascending: false })
    
  if (mealsError) console.error('Error fetching meals:', mealsError)

  // Fetch latest 5 interactions for insights (could be from meals of any date)
  const { data: recentInteractions } = await supabase.from('interactions')
    .select('*, meals!inner(patient_id)')
    .eq('meals.patient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const insightsData = recentInteractions?.map(i => ({
    type: i.type as 'like' | 'comment' | 'favorite',
    content: i.content
  })) || []

  // Get nutritionist info
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

  const todayMealsCount = todayMeals?.length || 0

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full bg-white/70 px-6 py-6 backdrop-blur-xl dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-outfit text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Nutri-<span className="text-sky-500 text-glow">Feed</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Panel del Paciente</p>
          </div>
          <form action={logout}>
            <button type="submit" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 transition-all hover:bg-red-50 hover:text-red-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-red-950/30" title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-8 px-6 pb-32 pt-8">
        {/* Priority Insights Section */}
        <section className="space-y-4">
          <NutritionistInsights interactions={insightsData} />
          <DailyProgressBar current={todayMealsCount} target={4} />
        </section>

        {/* Today's Timeline */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Hoy</h2>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
              <Calendar size={16} />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {!todayMeals || todayMeals.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center rounded-[2.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800/50">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-zinc-50 text-zinc-300 dark:bg-zinc-900">
                  <Plus size={32} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-outfit text-base font-bold text-zinc-900 dark:text-zinc-50">Día en blanco</h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 px-10 leading-relaxed">No has registrado nada todavía hoy. ¡Tu salud te lo agradecerá!</p>
              </div>
            ) : (
              todayMeals.map((meal) => (
                <MealCard 
                  key={meal.id} 
                  meal={meal} 
                  isEditable={isWithin24Hours(meal.meal_date || meal.created_at)} 
                  currentUserId={user.id} 
                />
              ))
            )}
          </div>
        </section>

        {/* History Link Section */}
        <section className="pt-4">
          <div className="mb-4 flex items-center gap-2 px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Memoria</span>
          </div>
          <HistoryLink />
        </section>
        
        <NutritionistConnect currentNutriEmail={nutritionistEmail} />
      </main>

      {/* Floating Action Button */}
      <NewMealForm />
    </div>
  )
}
