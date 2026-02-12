'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadMedia(formData) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: 'Unauthorized' };
    }

    const file = formData.get('file');
    if (!file) {
      return { error: 'No file provided' };
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return { error: 'Only image files are allowed' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('media')
      .getPublicUrl(filePath);

    // Get user metadata for uploader name from profiles table
    const { data: userData } = await supabase
      .from('profiles')
      .select('full_name') // Assuming 'full_name' exists based on typical profile schemas, falling back to name
      .eq('id', user.id)
      .single();

    const uploaderName = userData?.full_name || userData?.name || user.email?.split('@')[0] || 'Unknown';

    // Create record in media table
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        filename: fileName,
        original_filename: file.name,
        storage_path: filePath,
        public_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id,
        uploader_name: uploaderName
      })
      .select()
      .single();

    if (dbError) {
      // If database insert fails, delete the uploaded file
      await supabase.storage.from('media').remove([filePath]);
      console.error('Database error:', dbError);
      return { error: dbError.message };
    }

    return { 
      success: true, 
      data: mediaRecord 
    };

  } catch (error) {
    console.error('Upload media error:', error);
    return { error: error.message };
  }
}

export async function deleteMedia(mediaId) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: 'Unauthorized' };
    }

    // Get media record
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', mediaId)
      .single();

    if (fetchError || !media) {
      return { error: 'Media not found' };
    }

    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from('media')
      .remove([media.storage_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      return { error: storageError.message };
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return { error: dbError.message };
    }

    return { success: true };

  } catch (error) {
    console.error('Delete media error:', error);
    return { error: error.message };
  }
}
