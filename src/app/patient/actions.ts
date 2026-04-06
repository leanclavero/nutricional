'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createMeal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const mealType = formData.get('mealType') as string
  const comments = formData.get('comments') as string
  const photoUrls: string[] = []

  const photo = formData.get('photo') as File
  if (photo && photo.size > 0) {
    const fileExt = photo.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`
    const { error: uploadError } = await supabase.storage.from('meal-photos').upload(filePath, photo)
    if (uploadError) throw new Error(`Cloud upload failed: ${uploadError.message}`)
    const { data: { publicUrl } } = supabase.storage.from('meal-photos').getPublicUrl(filePath)
    photoUrls.push(publicUrl)
  }

  const { error } = await supabase.from('meals').insert({ patient_id: user.id, meal_type: mealType, comments, photo_urls: photoUrls })
  if (error) throw new Error(`Database error: ${error.message}`)
  revalidatePath('/patient')
}

export async function deleteMeal(mealId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('meals').delete().eq('id', mealId)
  if (error) throw new Error(`Delete failed: ${error.message}`)
  revalidatePath('/patient')
  revalidatePath('/patient')
}

export async function updateMealText(mealId: string, comments: string, mealType: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('meals')
    .update({ comments, meal_type: mealType })
    .eq('id', mealId)

  if (error) throw new Error(`Update failed: ${error.message}`)
  revalidatePath('/patient')
}
