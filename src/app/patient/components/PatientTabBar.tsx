'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, Plus, Stethoscope, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PatientTabBarProps {
  onPlusClick: () => void
}

export function PatientTabBar({ onPlusClick }: PatientTabBarProps) {
  const pathname = usePathname()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const tabs = [
    { label: 'Inicio', icon: Home, href: '/patient' },
    { label: 'Historial', icon: CalendarDays, href: '/patient/history' },
    { label: null, icon: Plus, href: null }, // center FAB
    { label: 'Mi Nutri', icon: Stethoscope, href: '/patient#nutri' },
    { label: 'Salir', icon: LogOut, href: null }, // logout
  ]

  return (
    <>
      {/* Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-zinc-100 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90 safe-area-inset-bottom">
        {tabs.map((tab, i) => {
          const Icon = tab.icon

          // Center FAB button
          if (tab.href === null && tab.label === null) {
            return (
              <button
                key={i}
                onClick={onPlusClick}
                className="-mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition-all active:scale-95 hover:bg-sky-600"
                aria-label="Nuevo registro"
              >
                <Plus size={26} strokeWidth={2.5} />
              </button>
            )
          }

          // Logout button
          if (tab.label === 'Salir') {
            return (
              <button
                key={i}
                onClick={() => setShowLogoutConfirm(true)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 text-zinc-400 transition-colors hover:text-red-500"
                aria-label="Cerrar sesión"
              >
                <Icon size={20} />
                <span className="text-[9px] font-semibold">{tab.label}</span>
              </button>
            )
          }

          // Regular link tabs
          const isActive = tab.href ? (tab.href === '/patient' ? pathname === '/patient' : pathname.startsWith(tab.href)) : false

          return (
            <Link
              key={i}
              href={tab.href!}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                isActive ? "text-sky-500" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <div className="relative">
                <Icon size={20} />
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-500"
                  />
                )}
              </div>
              <span className={cn("text-[9px] font-semibold", isActive && "text-sky-500")}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/30">
                <LogOut size={22} />
              </div>
              <h3 className="mb-1 font-outfit text-lg font-bold text-zinc-900 dark:text-zinc-50">¿Cerrar sesión?</h3>
              <p className="mb-5 text-sm text-zinc-500">Tu progreso está guardado. Puedes volver a iniciar sesión en cualquier momento.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-2xl border border-zinc-200 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Cancelar
                </button>
                <form action={logout} className="flex-1">
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600"
                  >
                    Salir
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
