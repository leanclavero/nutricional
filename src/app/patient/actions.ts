'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createMeal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const mealType = formData.get('mealType') as string
  const comments = formData.get('comments') as string
  const mealDate = formData.get('mealDate') as string || new Date().toISOString()
  const photoUrls: string[] = []

  const photos = formData.getAll('photos') as File[]
  for (const photo of photos) {
    if (photo && photo.size > 0) {
      const fileExt = photo.name.split('.').pop() || 'jpg'
      const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      
      const arrayBuffer = await photo.arrayBuffer()
      const { error: uploadError } = await supabase.storage.from('meal-photos').upload(filePath, arrayBuffer, {
        contentType: photo.type || 'image/jpeg'
      })
      
      if (uploadError) throw new Error(`Cloud upload failed: ${uploadError.message}`)
      const { data: { publicUrl } } = supabase.storage.from('meal-photos').getPublicUrl(filePath)
      photoUrls.push(publicUrl)
    }
  }

  const { error } = await supabase.from('meals').insert({ 
    patient_id: user.id, 
    meal_type: mealType, 
    comments, 
    photo_urls: photoUrls,
    meal_date: mealDate
  })
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

export async function updateMeal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const mealId = formData.get('mealId') as string
  const comments = formData.get('comments') as string
  const mealType = formData.get('mealType') as string
  const mealDate = formData.get('mealDate') as string

  // Fetch current photos to append to
  const { data: meal, error: fetchError } = await supabase
    .from('meals')
    .select('photo_urls')
    .eq('id', mealId)
    .single()

  if (fetchError || !meal) throw new Error(`Meal not found: ${fetchError?.message}`)

  const photoUrls: string[] = meal.photo_urls || []
  const newPhotos = formData.getAll('newPhotos') as File[]

  for (const photo of newPhotos) {
    if (photo && photo.size > 0) {
      const fileExt = photo.name.split('.').pop() || 'jpg'
      const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      
      const arrayBuffer = await photo.arrayBuffer()
      const { error: uploadError } = await supabase.storage.from('meal-photos').upload(filePath, arrayBuffer, {
        contentType: photo.type || 'image/jpeg'
      })
      
      if (uploadError) throw new Error(`Cloud upload failed: ${uploadError.message}`)
      const { data: { publicUrl } } = supabase.storage.from('meal-photos').getPublicUrl(filePath)
      photoUrls.push(publicUrl)
    }
  }

  const { error } = await supabase
    .from('meals')
    .update({ comments, meal_type: mealType, meal_date: mealDate, photo_urls: photoUrls })
    .eq('id', mealId)

  if (error) throw new Error(`Update failed: ${error.message}`)
  revalidatePath('/patient')
}

export async function connectNutritionist(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: nutri, error: nutriError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .eq('role', 'nutritionist')
    .single()

  if (nutriError || !nutri) throw new Error('Nutricionista no encontrado con ese email')

  const { error } = await supabase
    .from('profiles')
    .update({ nutritionist_id: nutri.id })
    .eq('id', user.id)

  if (error) throw new Error(`Error vinculando: ${error.message}`)
  revalidatePath('/patient')
}

export async function addPatientComment(mealId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('interactions').insert({
    meal_id: mealId,
    user_id: user.id,
    type: 'comment',
    content
  })

  if (error) throw new Error(`Comment failed: ${error.message}`)

  // Notify nutritionist if exists
  const { data: profile } = await supabase.from('profiles').select('nutritionist_id').eq('id', user.id).single()
  if (profile?.nutritionist_id) {
    await supabase.from('notifications').insert({
      user_id: profile.nutritionist_id,
      meal_id: mealId,
      content: `Nuevo mensaje de paciente en registro de comida.`
    })
  }

  revalidatePath('/patient')
  revalidatePath('/nutritionist')
}

export async function updateDailyMealsTarget(target: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profiles')
    .update({ daily_meals_target: target })
    .eq('id', user.id)

  if (error) throw new Error(`Error actualizando objetivo: ${error.message}`)
  revalidatePath('/patient')
}

