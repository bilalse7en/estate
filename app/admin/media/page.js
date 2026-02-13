import { createClient } from '@/lib/supabase/server';
import MediaLibraryClient from './MediaLibraryClient';

export const metadata = {
  title: 'Media Library',
};

export const dynamic = 'force-dynamic';

export default async function MediaLibraryPage() {
  const supabase = await createClient();
  
  const { data: media, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching media:', error);
  }

  return <MediaLibraryClient initialMedia={media || []} />;
}
