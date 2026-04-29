import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '../components/PageHeader'
import { MessageCircle, Mail, ShieldCheck, Star } from 'lucide-react'

export default async function NutriPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nutritionist_id')
    .eq('id', user.id)
    .single()

  let nutritionist = null
  if (profile?.nutritionist_id) {
    const { data: nutri } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', profile.nutritionist_id)
      .single()
    nutritionist = nutri
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      <PageHeader title="Mi Nutri" subtitle="Tu acompañamiento profesional" />
      
      <main className="mx-auto max-w-lg p-6 space-y-6">
        {!nutritionist ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-300 dark:bg-zinc-900">
              <ShieldCheck size={32} />
            </div>
            <h3 className="mt-6 font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">Sin Nutricionista</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 px-6">Aún no tienes un nutricionista vinculado a tu cuenta.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 dark:bg-sky-900/20 mb-4">
                <Star size={40} fill="currentColor" />
              </div>
              <h2 className="font-outfit text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {nutritionist.full_name || 'Tu Nutricionista'}
              </h2>
              <p className="text-zinc-400 text-xs mt-1 uppercase tracking-widest font-bold">Nutrición Deportiva y Clínica</p>
              
              <div className="mt-8 flex gap-3">
                <a 
                  href={`mailto:${nutritionist.email}`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
                >
                  <Mail size={16} /> Enviar Mail
                </a>
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-sky-500 p-6 text-white shadow-lg shadow-sky-500/20">
              <h4 className="text-sm font-black uppercase tracking-widest">Nota Profesional</h4>
              <p className="mt-2 text-xs leading-relaxed opacity-90 font-medium">
                Tu nutricionista está supervisando tus registros. Recuerda que la consistencia es la clave para alcanzar tus objetivos de salud y rendimiento.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
