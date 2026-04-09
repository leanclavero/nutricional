'use client'

import { useState } from 'react'
import { PatientTabBar } from './PatientTabBar'
import { NewMealForm } from './NewMealForm'

export function PatientShell({ children }: { children: React.ReactNode }) {
  const [isMealFormOpen, setIsMealFormOpen] = useState(false)

  return (
    <>
      {children}
      <NewMealForm isOpen={isMealFormOpen} onClose={() => setIsMealFormOpen(false)} />
      <PatientTabBar onPlusClick={() => setIsMealFormOpen(true)} />
    </>
  )
}
