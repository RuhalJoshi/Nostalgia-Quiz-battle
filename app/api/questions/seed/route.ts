import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SAMPLE_QUESTIONS } from '@/lib/questions'

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if questions already exist
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
      return NextResponse.json({ message: 'Questions already seeded' }, { status: 200 })
    }

    // Insert sample questions
    const { error } = await supabase
      .from('questions')
      .insert(SAMPLE_QUESTIONS.map(q => ({
        category: q.category,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        difficulty: q.difficulty,
      })))

    if (error) {
      console.error('Error seeding questions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Questions seeded successfully' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

