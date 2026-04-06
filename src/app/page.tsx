import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

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

  // Default fallback if no role is found
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold">Bienvenido a Nutri-Feed</h1>
      <p className="mt-2 text-zinc-600">Configurando tu perfil...</p>
    </div>
  )
}
