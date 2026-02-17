'use server';

import { createClient } from '@/lib/supabase/server';

export async function runCleanupOldData() {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: 'Supabase client unavailable' };

    // Call the cleanup function we created in SQL
    const { data, error } = await supabase.rpc('cleanup_old_inquiries');

    if (error) {
      console.error('Cleanup error:', error);
      return { error: error.message };
    }

    return { 
      success: true, 
      deletedInquiries: data[0]?.deleted_inquiries || 0,
      deletedMedia: data[0]?.deleted_media || 0
    };
  } catch (error) {
    console.error('Cleanup execution error:', error);
    return { error: error.message };
  }
}

export async function markMediaAsWebsiteAsset(mediaId) {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: 'Supabase client unavailable' };

    const { error } = await supabase
      .from('media')
      .update({ 
        is_website_asset: true,
        last_used_at: new Date().toISOString()
      })
      .eq('id', mediaId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Mark asset error:', error);
    return { error: error.message };
  }
}

export async function checkDuplicateMedia(filename) {
  try {
    const supabase = await createClient();
    if (!supabase) return { exists: false };

    const { data, error } = await supabase
      .from('media')
      .select('id, filename, original_filename, public_url')
      .eq('original_filename', filename)
      .limit(1);

    if (error) {
      console.warn('Duplicate check error:', error);
      return { exists: false };
    }

    return { 
      exists: data && data.length > 0,
      existing: data?.[0] || null
    };
  } catch (error) {
    console.error('Duplicate check error:', error);
    return { exists: false };
  }
}
