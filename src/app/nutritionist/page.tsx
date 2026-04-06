import { logout } from '@/app/auth/actions'

export default function NutritionistFeed() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 p-6 dark:bg-zinc-950">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Panel del Nutricionista</h1>
        <form action={logout}>
          <button type="submit" className="text-sm font-medium text-red-500 hover:text-red-600">
            Cerrar Sesión
          </button>
        </form>
      </header>
      <main className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-zinc-600 dark:text-zinc-400">¡Tu feed de pacientes está en camino!</p>
      </main>
    </div>
  )
}
