import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '../components/PageHeader'
import { FileDown } from 'lucide-react'

export default async function DownloadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      <PageHeader title="Descargas" subtitle="Tus documentos" />
      
      <main className="mx-auto max-w-lg p-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-300 dark:bg-zinc-900">
            <FileDown size={32} />
          </div>
          <h3 className="mt-6 font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">Sin archivos</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Aquí aparecerán tus planes de alimentación y recetas en PDF.</p>
        </div>
      </main>
    </div>
  )
}
