import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '../components/PageHeader'
import { HistoryView } from '../components/HistoryView'

export default async function PatientHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meals, error } = await supabase.from('meals')
    .select('*, interactions(*)')
    .eq('patient_id', user.id)
    .order('meal_date', { ascending: false })
    
  if (error) console.error('Error fetching meals:', error)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      <PageHeader title="Historial Completo" subtitle="Todo tu camino" />
      
      <main className="mx-auto max-w-lg pt-6">
        <HistoryView meals={meals || []} currentUserId={user.id} />
      </main>
    </div>
  )
}
