'use client'

import { useState } from 'react'
import { PatientTabBar } from './PatientTabBar'
import { NewMealForm } from './NewMealForm'
import { PatientMoreDrawer } from './PatientMoreDrawer'

export function PatientShell({ children }: { children: React.ReactNode }) {
  const [isMealFormOpen, setIsMealFormOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

  return (
    <>
      {children}
      <NewMealForm isOpen={isMealFormOpen} onClose={() => setIsMealFormOpen(false)} />
      <PatientMoreDrawer isOpen={isMoreMenuOpen} onClose={() => setIsMoreMenuOpen(false)} />
      <PatientTabBar 
        onPlusClick={() => setIsMealFormOpen(true)} 
        onMoreClick={() => setIsMoreMenuOpen(true)}
      />
    </>
  )
}
