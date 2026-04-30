import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft, Calendar, FileUp, Flame, LayoutGrid, Clock } from 'lucide-react'
import Link from 'next/link'
import { RegistrationHeatmap } from '@/app/patient/components/RegistrationHeatmap'
import { NutritionistHistoryView } from '../../components/NutritionistHistoryView'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function PatientProfileView({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify this patient belongs to this nutritionist
  const { data: patient, error: patientError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('nutritionist_id', user.id)
    .single()

  if (patientError || !patient) return notFound()

  const { data: meals } = await supabase
    .from('meals')
    .select('*, interactions(*)')
    .eq('patient_id', id)
    .order('meal_date', { ascending: false })

  // Heatmap calculation logic (Shared with patient page ideally)
  const heatmapData = Array.from({ length: 7 * 24 }, (_, i) => ({
    day: Math.floor(i / 24),
    hour: i % 24,
    count: 0
  }))

  meals?.forEach(meal => {
    const date = new Date(meal.meal_date)
    const day = (date.getDay() + 6) % 7 // Monday = 0
    const hour = date.getHours()
    const cell = heatmapData.find(d => d.day === day && d.hour === hour)
    if (cell) cell.count++
  })

  return (
    <div className="min-h-screen bg-zinc-50 pb-32 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <Link href="/nutritionist/patients" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 dark:bg-zinc-800">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="font-outfit text-lg font-black text-zinc-900 dark:text-zinc-50">
              {patient.full_name || patient.email}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Expediente del Paciente</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 pt-6">
        {/* Actions Bar */}
        <section className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-sky-500/20 transition-transform active:scale-95">
            <Calendar size={16} />
            Agendar
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-widest text-zinc-600 shadow-sm ring-1 ring-zinc-100 transition-transform active:scale-95 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-white/5">
            <FileUp size={16} />
            Cargar Archivo
          </button>
        </section>

        {/* Heatmap Section */}
        <section className="rounded-[2.5rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <Flame size={16} />
              </div>
              <h2 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">Zonas Horarias</h2>
            </div>
          </div>
          <RegistrationHeatmap data={heatmapData} />
        </section>

        {/* History Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/10">
                <Clock size={16} />
              </div>
              <h2 className="font-outfit text-sm font-bold text-zinc-900 dark:text-zinc-50">Historial Completo</h2>
            </div>
          </div>
          <NutritionistHistoryView meals={meals || []} currentUserId={user.id} />
        </section>
      </main>
    </div>
  )
}
