import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Update all businesses to set is_claimed to true
    const { data, error } = await supabase
      .from('businesses')
      .update({ is_claimed: true })
      .eq('is_claimed', false)
      .select('id');

    if (error) {
      console.error('Error updating businesses:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updatedCount: data?.length || 0,
      message: `Successfully updated ${data?.length || 0} businesses`
    });
  } catch (error) {
    console.error('Error in update route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 