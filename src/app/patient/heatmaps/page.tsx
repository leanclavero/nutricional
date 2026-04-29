import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ChevronLeft, Flame, Info, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { RegistrationHeatmap } from '../components/RegistrationHeatmap'

export default async function HeatmapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all meals to aggregate by hour
  const { data: meals } = await supabase
    .from('meals')
    .select('meal_date, created_at')
    .eq('patient_id', user.id)

  const cellCounts: { day: number, hour: number, count: number }[] = []
  
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      cellCounts.push({ day: d, hour: h, count: 0 })
    }
  }

  meals?.forEach((meal) => {
    const date = new Date(meal.meal_date || meal.created_at)
    // Convert to Mon=0, Sun=6
    const day = (date.getDay() + 6) % 7
    const hour = date.getHours()
    
    const cell = cellCounts.find(c => c.day === day && c.hour === hour)
    if (cell) cell.count++
  })

  // Hourly counts for the peak hour summary
  const hourlyTotals = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: cellCounts.filter(c => c.hour === hour).reduce((acc, curr) => acc + curr.count, 0)
  }))

  const peakHourData = [...hourlyTotals].sort((a, b) => b.count - a.count)[0]
  const totalRegistrations = meals?.length || 0

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      <header className="sticky top-0 z-50 w-full bg-white/70 px-6 py-4 backdrop-blur-xl dark:bg-zinc-900/70 border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <Link href="/patient" className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Heatmaps de Ingesta
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Patrones de registro</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg p-6 space-y-6">
        {/* Insights Card */}
        <section className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 dark:bg-orange-950/30">
              <Flame size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Hora Pico</p>
              <h3 className="font-outfit text-lg font-black text-zinc-900 dark:text-zinc-50">
                {peakHourData.count > 0 ? `${peakHourData.hour}:00` : '--:--'}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-500 dark:bg-sky-950/30">
              <TrendingUp size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total</p>
              <h3 className="font-outfit text-lg font-black text-zinc-900 dark:text-zinc-50">
                {totalRegistrations} <span className="text-[10px] font-bold text-zinc-300">comidas</span>
              </h3>
            </div>
          </div>
        </section>

        {/* The Heatmap */}
        <section className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="mb-8">
            <h2 className="font-outfit text-lg font-black text-zinc-900 dark:text-zinc-50">Actividad por Hora</h2>
            <p className="text-xs text-zinc-500">Visualiza en qué momentos del día sueles registrar tus comidas con mayor frecuencia.</p>
          </div>
          
          <RegistrationHeatmap data={cellCounts} />
        </section>

        {/* Info Box */}
        <section className="flex items-start gap-4 rounded-3xl bg-zinc-900 p-6 text-white dark:bg-zinc-50 dark:text-zinc-900">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400 dark:bg-zinc-200 dark:text-zinc-500">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold">¿Cómo leer este mapa?</h4>
            <p className="mt-1 text-xs leading-relaxed opacity-70">
              Los bloques más intensos representan las horas donde más registros has realizado históricamente. Esto te ayuda a identificar tus rutinas y posibles baches en tu alimentación.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
