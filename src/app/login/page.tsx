'use client'

import { useActionState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { login } from '@/app/auth/actions'
import { useSearchParams } from 'next/navigation'

import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  // UI state for loading transition using action state is possible, but Since we use server actions directly in standard forms:
  // Instead of useActionState since the original setup uses redirect, we'll just handle basic client-side loading visually.
  // Actually, standard forms with redirect don't provide easy client-side loading feedback unless we intercept it.
  
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="overflow-hidden rounded-3xl bg-white/70 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:bg-zinc-900/70 dark:ring-white/10">
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Nutri-Feed
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Ingresa a tu espacio de salud inteligente
              </p>
            </div>

            {/* Error Alert Box */}
            {errorParam && (
              <div className="mb-6 flex animate-in slide-in-from-top-2 items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-600 shadow-sm ring-1 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  {errorParam === 'Could not authenticate user' 
                    ? 'Credenciales incorrectas o cuenta sin confirmar. Verifica tu email.' 
                    : errorParam}
                </p>
              </div>
            )}

            <form action={login} className="space-y-6">
              <div className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Contraseña
                    </label>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="mt-2 block w-full rounded-xl border-0 bg-zinc-100/50 px-4 py-3.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700/50 dark:focus:bg-zinc-900 dark:focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <SubmitButton />
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">¿Eres nuevo aquí? </span>
              <a href="/signup" className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Crea tu cuenta gratuita
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>}>
      <LoginContent />
    </Suspense>
  )
}

import { useFormStatus } from 'react-dom'

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
          <span>Autenticando...</span>
        </div>
      ) : (
        <span>Ingresar a la Plataforma</span>
      )}
      
      {/* Glossy Button Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
    </button>
  )
}
