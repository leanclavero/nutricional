'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Stethoscope, 
  Calendar, 
  Settings, 
  Flame, 
  Download, 
  LogOut, 
  User, 
  ChevronRight,
  ClipboardList
} from 'lucide-react'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'

interface PatientMoreDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function PatientMoreDrawer({ isOpen, onClose }: PatientMoreDrawerProps) {
  const menuItems = [
    { label: 'Mi Nutri', icon: Stethoscope, href: '/patient/nutri' },
    { label: 'Turnos', icon: Calendar, href: '/patient/appointments' },
    { label: 'Heatmaps', icon: Flame, href: '/patient/heatmaps' },
    { label: 'Descargas', icon: Download, href: '/patient/downloads' },
  ]

  const configItems = [
    { label: 'Ingestas diarias', icon: ClipboardList, href: '/patient/settings/goals' },
    { label: 'Perfil', icon: User, href: '/patient/profile' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[110] max-h-[85vh] overflow-y-auto rounded-t-[2.5rem] bg-white p-8 shadow-2xl dark:bg-zinc-900"
          >
            {/* Handle */}
            <div className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800" />

            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-outfit text-2xl font-black text-zinc-900 dark:text-zinc-50">Menú</h2>
              <button 
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Main Menu */}
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={onClose}
                    className="flex flex-col items-center gap-3 rounded-3xl border border-zinc-100 bg-zinc-50/50 p-6 text-center transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                      <item.icon size={24} />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Configurations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <Settings size={16} className="text-zinc-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Configuraciones</span>
                </div>
                <div className="overflow-hidden rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  {configItems.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between bg-white px-6 py-4 transition-all hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 ${i !== configItems.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-zinc-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-50 py-4 text-sm font-bold text-red-500 transition-all hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                >
                  <LogOut size={20} />
                  Cerrar sesión
                </button>
              </form>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600">Nutri-Feed v1.2</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
