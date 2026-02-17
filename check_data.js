
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('Checking site_settings table...');
  const { data, error } = await supabase.from('site_settings').select('*');
  
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  
  console.log('--- DATA START ---');
  console.log(JSON.stringify(data, null, 2));
  console.log('--- DATA END ---');
}

checkData();
