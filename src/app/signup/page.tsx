'use client'

import { useSearchParams } from 'next/navigation'
import { AlertCircle, Loader2 } from 'lucide-react'
import { signup } from '@/app/auth/actions'
import { useFormStatus } from 'react-dom'

export default function SignupPage() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-zinc-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10" />
      <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-600/10" />

      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white/70 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:bg-zinc-900/70 dark:ring-white/10">
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Únete a Nutri-Feed
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Comienza hoy mismo tu transformación saludable
              </p>
            </div>

            {/* Error Alert Box */}
            {errorParam && (
              <div className="mb-6 flex animate-in slide-in-from-top-2 items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-600 shadow-sm ring-1 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  {errorParam === 'Could not create user'
                    ? 'No pudimos crear tu cuenta. Verifica tus datos o intenta con otro correo.'
                    : errorParam}
                </p>
              </div>
            )}

            <form action={signup} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Tu correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="hola@ejemplo.com"
                  className="mt-2 block w-full rounded-xl border-0 bg-zinc-100/50 px-4 py-3.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700/50 dark:focus:bg-zinc-900 dark:focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Contraseña (mínimo 6 caracteres)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  placeholder="••••••••"
                  className="mt-2 block w-full rounded-xl border-0 bg-zinc-100/50 px-4 py-3.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700/50 dark:focus:bg-zinc-900 dark:focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  ¿Cómo usarás la aplicación?
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

              <div className="pt-2">
                <SubmitButton />
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">¿Ya tienes cuenta? </span>
              <a href="/login" className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Inicia sesión aquí
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`group relative flex w-full justify-center overflow-hidden rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-[0.98] ${
        pending ? 'cursor-not-allowed opacity-80' : ''
      }`}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Creando Perfil...</span>
        </div>
      ) : (
        <span>Comenzar Ahora</span>
      )}
      
      {/* Glossy Button Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
    </button>
  )
}
