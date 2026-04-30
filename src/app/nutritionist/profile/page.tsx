import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, Mail, Shield, LogOut, Bell, Settings } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export default async function NutritionistProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="pb-32 pt-8 px-4 max-w-lg mx-auto">
      <header className="mb-8">
        <h1 className="font-outfit text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Mi <span className="text-sky-500">Perfil</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Configuración profesional</p>
      </header>

      <div className="space-y-4">
        {/* Profile Card */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-sky-400 to-sky-600 text-3xl font-bold text-white shadow-xl shadow-sky-500/20 mb-4 uppercase">
              {user.email?.[0]}
            </div>
            <h2 className="font-outfit text-xl font-black text-zinc-900 dark:text-zinc-50">
              Nutricionista
            </h2>
            <p className="text-sm font-medium text-zinc-500">{user.email}</p>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-2">
          <div className="rounded-3xl bg-white p-2 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-white/5">
            <button className="flex w-full items-center gap-4 rounded-2xl p-4 text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/10">
                <Mail size={18} />
              </div>
              <span className="flex-1 text-left text-sm font-bold">Email y Notificaciones</span>
              <Bell size={16} className="text-zinc-300" />
            </button>
            <button className="flex w-full items-center gap-4 rounded-2xl p-4 text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
                <Shield size={18} />
              </div>
              <span className="flex-1 text-left text-sm font-bold">Seguridad</span>
              <Settings size={16} className="text-zinc-300" />
            </button>
          </div>

          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-4 rounded-3xl bg-white p-6 text-red-500 shadow-sm ring-1 ring-zinc-100 transition-colors hover:bg-red-50 dark:bg-zinc-900 dark:ring-white/5 dark:hover:bg-red-950/20">
              <LogOut size={20} />
              <span className="font-black uppercase tracking-widest text-xs">Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
