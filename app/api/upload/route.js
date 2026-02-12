import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Verify user is authenticated and admin
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    //Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    // Upload to Supabase Storage (using the new media bucket)
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    // Get user metadata for uploader name from profiles table
    const { data: userData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', session.user.id)
      .single();

    const uploaderName = userData?.name || session.user.email?.split('@')[0] || 'Unknown';

    // Create record in media table
    await supabase
      .from('media')
      .insert({
        filename: fileName,
        original_filename: file.name,
        storage_path: fileName,
        public_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: session.user.id,
        uploader_name: uploaderName
      });

    return NextResponse.json({
      success: true,
      url: publicUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
