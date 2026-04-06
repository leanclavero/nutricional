'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addInteraction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const mealId = formData.get('mealId') as string
  const type = formData.get('type') as 'like' | 'comment'
  const content = formData.get('content') as string

  const { error } = await supabase.from('interactions').insert({
    meal_id: mealId,
    nutritionist_id: user.id,
    type,
    content,
  })

  if (error) {
    console.error('Interaction error:', error)
    throw new Error(`Failed to add interaction: ${error.message}`)
  }

  revalidatePath('/nutritionist')
}

export async function deleteInteraction(interactionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', interactionId)

  if (error) {
    throw new Error(`Failed to delete interaction: ${error.message}`)
  }

  revalidatePath('/nutritionist')
}
