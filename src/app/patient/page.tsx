import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MealCard } from './components/MealCard'
import { NutritionistConnect } from './components/NutritionistConnect'
import { DailyProgressBar } from './components/DailyProgressBar'
import { LastMealCounter } from './components/LastMealCounter'
import { Calendar, Plus } from 'lucide-react'
import { cookies } from 'next/headers'

export default async function PatientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get user timezone from cookie
  const cookieStore = await cookies()
  const userTimezone = cookieStore.get('user-timezone')?.value || 'UTC'

  // Calculate start of today in user's timezone
  const now = new Date()
  let startOfTodayUTC: Date

  try {
    // This creates a date string in the user's timezone and then parses it as local to find the day boundary
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    })
    
    const parts = formatter.formatToParts(now)
    const p: any = {}
    parts.forEach(part => { p[part.type] = part.value })
    
    // Create a date object that represents 00:00:00 on the current day in the user's timezone
    const userLocalStart = new Date(`${p.year}-${p.month.padStart(2, '0')}-${p.day.padStart(2, '0')}T00:00:00`)
    
    // We need to find the UTC equivalent of that local start
    // A simple way is to use the difference between now and the formatted now
    const userNow = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
    const offsetMs = userNow.getTime() - now.getTime()
    
    startOfTodayUTC = new Date(userLocalStart.getTime() - offsetMs)
  } catch (e) {
    // Fallback to a safer 6-hour window if timezone logic fails
    startOfTodayUTC = new Date()
    startOfTodayUTC.setHours(startOfTodayUTC.getHours() - 6)
    startOfTodayUTC.setHours(0, 0, 0, 0)
  }

  // Fetch only today's meals using the calculated UTC start
  const { data: todayMeals, error: mealsError } = await supabase.from('meals')
    .select('*, interactions(*)')
    .eq('patient_id', user.id)
    .gte('meal_date', startOfTodayUTC.toISOString())
    .order('meal_date', { ascending: false })

  if (mealsError) console.error('Error fetching meals:', mealsError)

  // Fetch the absolute last meal for the counter
  const { data: lastMeal } = await supabase.from('meals')
    .select('meal_date')
    .eq('patient_id', user.id)
    .order('meal_date', { ascending: false })
    .limit(1)
    .single()

  // Get nutritionist info and daily target
  const { data: profile } = await supabase.from('profiles').select('nutritionist_id, daily_meals_target').eq('id', user.id).single()
  let nutritionistEmail = null
  if (profile?.nutritionist_id) {
    const { data: nutri } = await supabase.from('profiles').select('email').eq('id', profile.nutritionist_id).single()
    nutritionistEmail = nutri?.email
  }
  const dailyTarget = profile?.daily_meals_target || 4

  const isWithin24Hours = (date: string) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    return diff < 24
  }

  const todayMealsCount = todayMeals?.length || 0

  return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div>
              <h1 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Nutri-<span className="text-sky-500">Feed</span>
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Panel del Paciente</p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-lg space-y-4 px-4 pb-24 pt-4">
          {/* Insights + Progress */}
          <section className="space-y-2.5">
            <LastMealCounter lastMealDate={lastMeal?.meal_date || null} />
            <DailyProgressBar current={todayMealsCount} target={dailyTarget} meals={todayMeals || []} />
          </section>

          {/* Today's meals */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-outfit text-base font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Hoy
              </h2>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                <Calendar size={14} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {!todayMeals || todayMeals.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-100 py-8 text-center dark:border-zinc-800/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-300 dark:bg-zinc-900">
                    <Plus size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    Día en blanco
                  </h3>
                  <p className="mt-1 px-8 text-xs text-zinc-500 dark:text-zinc-400">
                    No has registrado nada todavía. ¡Tu salud te lo va a agradecer!
                  </p>
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

          {/* Nutritionist connect section */}
          <section id="nutri" className="pt-1">
            <NutritionistConnect currentNutriEmail={nutritionistEmail} />
          </section>
        </main>
      </div>
  )
}
