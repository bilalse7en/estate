
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://uykgpmgcayncaddtsspu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5a2dwbWdjYXluY2FkZHRzc3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQxNjksImV4cCI6MjA4NjI4MDE2OX0.ekzjGRRbUbQnkv5Dk3xqTc0odChxJLdlYt8dLyd6v2E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHomepage() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'homepage').maybeSingle();
  if (data) {
    console.log('--- HOMEPAGE CONTENT ---');
    console.log(JSON.stringify(data.content, null, 2));
  } else {
    console.log('Homepage not found');
  }
}
checkHomepage();
