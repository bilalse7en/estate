
const { createClient } = require('@supabase/supabase-js');

// Embedded credentials for a quick fix
const supabaseUrl = 'https://uykgpmgcayncaddtsspu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5a2dwbWdjYXluY2FkZHRzc3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQxNjksImV4cCI6MjA4NjI4MDE2OX0.ekzjGRRbUbQnkv5Dk3xqTc0odChxJLdlYt8dLyd6v2E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('Checking site_settings table...');
  const { data, error } = await supabase.from('site_settings').select('id, content').limit(50);
  
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  
  console.log('Retrieved IDs:', data.map(d => d.id));
  data.forEach(d => {
    console.log(`ID: ${d.id}`);
    console.log(`Content keys: ${Object.keys(d.content || {})}`);
  });
}

checkData();
