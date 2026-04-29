import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '../components/PageHeader'
import { User } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      <PageHeader title="Mi Perfil" subtitle="Tus datos personales" />
      
      <main className="mx-auto max-w-lg p-6 space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300 mb-4 dark:bg-zinc-800">
            <User size={48} />
          </div>
          <h2 className="font-outfit text-xl font-black text-zinc-900 dark:text-zinc-50">{user.email}</h2>
          <p className="text-zinc-400 text-xs mt-1">ID de Paciente: {user.id.slice(0, 8)}</p>
        </div>
      </main>
    </div>
  )
}
