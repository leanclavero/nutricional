'use client'

import { useEffect } from 'react'

export function TimezoneSetter() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    document.cookie = `user-timezone=${tz}; path=/; max-age=31536000; SameSite=Lax`
  }, [])

  return null
}
