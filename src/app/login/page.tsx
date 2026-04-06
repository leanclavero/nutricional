import { login } from '@/app/auth/actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 dark:ring-1 dark:ring-white/10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Nutri-Feed</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Ingresa para continuar con tu seguimiento nutricional</p>
        </div>
        <form action={login} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <input id="email" name="email" type="email" required className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50" placeholder="tu@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Contraseña</label>
              <input id="password" name="password" type="password" required className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50" placeholder="••••••••" />
            </div>
          </div>
          <div><button type="submit" className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Iniciar Sesión</button></div>
        </form>
        <div className="mt-6 text-center text-sm"><span className="text-zinc-600 dark:text-zinc-400">¿No tienes cuenta? </span><a href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Regístrate aquí</a></div>
      </div>
    </div>
  )
}
