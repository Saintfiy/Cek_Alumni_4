import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkmyssnpsswglepawngc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbXlzc25wc3N3Z2xlcGF3bmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODQ1MDYsImV4cCI6MjA5MjM2MDUwNn0.fUYK0Zu9dLM5oLw0SqwEY_AbCsPjYd_LLjSzaqVgR6U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fixUrl = (url) => {
  if (!url) return url;
  let newUrl = url.trim();
  
  // Remove http:// or https:// temporarily
  if (newUrl.startsWith('https://')) {
    newUrl = newUrl.slice(8);
  } else if (newUrl.startsWith('http://')) {
    newUrl = newUrl.slice(7);
  }

  // Remove www. temporarily
  if (newUrl.startsWith('www.')) {
    newUrl = newUrl.slice(4);
  }
  
  return `https://www.${newUrl}`;
};

async function fixDatabase() {
  const { data, error } = await supabase.from('alumni').select('id, linkedin, instagram, facebook, tiktok, workplace_social_media');
  
  if (error) {
    console.error(error);
    return;
  }

  for (const row of data) {
    const updates = {};
    const fields = ['linkedin', 'instagram', 'facebook', 'tiktok', 'workplace_social_media'];
    let changed = false;
    for (const field of fields) {
      if (row[field]) {
        const fixed = fixUrl(row[field]);
        if (fixed !== row[field]) {
          updates[field] = fixed;
          changed = true;
        }
      }
    }

    if (changed) {
      const { error: updateError } = await supabase.from('alumni').update(updates).eq('id', row.id);
      if (updateError) {
        console.error('Error updating', row.id, updateError);
      } else {
        console.log('Updated', row.id, updates);
      }
    }
  }
  console.log('Database URL fix complete');
}

fixDatabase();
