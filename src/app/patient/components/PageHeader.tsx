'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 px-6 py-4 backdrop-blur-xl dark:bg-zinc-900/70 border-b border-zinc-100 dark:border-zinc-800">
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <Link href="/patient" className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex flex-col">
          <h1 className="font-outfit text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{subtitle}</p>
        </div>
      </div>
    </header>
  )
}
