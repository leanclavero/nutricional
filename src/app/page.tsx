import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { completeProfile } from '@/app/auth/actions'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to determine role and redirect accordingly
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'nutritionist') {
    redirect('/nutritionist')
  } else if (profile?.role === 'patient') {
    redirect('/patient')
  }

  // Auto-Rescue Fallback if profile doesn't exist (e.g., generated manually in Supabase Dashboard)
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 p-4 dark:bg-zinc-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
      <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />

      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white/70 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:bg-zinc-900/70 dark:ring-white/10">
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                ¡Bienvenido a Nutri-Feed!
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Vemos que tu cuenta es nueva. Por favor, completa tu configuración.
              </p>
            </div>

            <form action={completeProfile} className="space-y-6">
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  ¿Cómo usarás la plataforma?
                </label>
                <div className="mt-2 relative">
                  <select
                    id="role"
                    name="role"
                    required
                    className="block w-full appearance-none rounded-xl border-0 bg-zinc-100/50 px-4 py-3.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700/50 dark:focus:bg-zinc-900 dark:focus:ring-blue-500"
                  >
                    <option value="" disabled selected hidden>Selecciona tu perfil...</option>
                    <option value="patient">🏃 Soy Paciente (Registrar comidas)</option>
                    <option value="nutritionist">🩺 Soy Nutricionista (Monitorear pacientes)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-[0.98]"
              >
                <span>Finalizar Configuración</span>
                {/* Glossy Button Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
              </button>
            </form>

            <div className="mt-8">
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-red-500 dark:text-zinc-400"
                >
                  <LogOut className="h-4 w-4" />
                  Volver al Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
