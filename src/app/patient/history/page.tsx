import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MealCard } from '../components/MealCard'
import { ChevronLeft, History } from 'lucide-react'
import Link from 'next/link'
import * as motion from 'framer-motion/client'

export default async function PatientHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meals, error } = await supabase.from('meals')
    .select('*, interactions(*)')
    .eq('patient_id', user.id)
    .order('meal_date', { ascending: false })
    
  if (error) console.error('Error fetching meals:', error)

  const currentUserId = user.id

  const isWithin24Hours = (date: string) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    return diff < 24
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full bg-white/70 px-6 py-4 backdrop-blur-xl dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <Link href="/patient" className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Historial Completo
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Todo tu camino</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-8 px-6 pb-20 pt-8">
        {!meals || meals.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="glass-morphism flex h-24 w-24 items-center justify-center rounded-[2rem] text-zinc-300">
              <History size={40} strokeWidth={1} />
            </div>
            <h3 className="mt-6 font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">Sin registros</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 px-10">Aún no has registrado ninguna comida en tu historia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {meals.map((meal) => (
              <MealCard 
                key={meal.id} 
                meal={meal} 
                isEditable={isWithin24Hours(meal.meal_date || meal.created_at)} 
                currentUserId={currentUserId} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
