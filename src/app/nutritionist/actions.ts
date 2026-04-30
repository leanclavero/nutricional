'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addInteraction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const mealId = formData.get('mealId') as string
  const type = formData.get('type') as 'like' | 'comment' | 'favorite'
  const content = formData.get('content') as string

  const { error } = await supabase.from('interactions').insert({
    meal_id: mealId,
    user_id: user.id,
    type,
    content,
  })

  if (error) throw new Error(`Interaction failed: ${error.message}`)
  revalidatePath('/nutritionist')
}

export async function toggleInteraction(mealId: string, type: 'like' | 'favorite') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('interactions')
    .select('id')
    .eq('meal_id', mealId)
    .eq('user_id', user.id)
    .eq('type', type)
    .maybeSingle()

  if (existing) {
    await supabase.from('interactions').delete().eq('id', existing.id)
  } else {
    await supabase.from('interactions').insert({
      meal_id: mealId,
      user_id: user.id,
      type
    })
  }
  revalidatePath('/nutritionist')
}

export async function updateInteraction(id: string, content: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('interactions').update({ content }).eq('id', id)
  if (error) throw new Error(`Update failed: ${error.message}`)
  revalidatePath('/nutritionist')
}

export async function deleteInteraction(interactionId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('interactions').delete().eq('id', interactionId)
  if (error) throw new Error(`Delete failed: ${error.message}`)
  revalidatePath('/nutritionist')
}

export async function createAppointment(data: { patientId: string, date: string, type: string, notes?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('appointments').insert({
    nutritionist_id: user.id,
    patient_id: data.patientId,
    appointment_date: data.date,
    type: data.type,
    notes: data.notes,
    status: 'pending'
  })

  if (error) throw new Error(`Failed to create appointment: ${error.message}`)
  
  revalidatePath('/nutritionist')
  revalidatePath('/nutritionist/appointments')
  revalidatePath('/patient/appointments')
}
