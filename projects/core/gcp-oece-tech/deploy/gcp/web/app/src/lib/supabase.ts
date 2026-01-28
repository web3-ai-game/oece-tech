import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://qhgdymgxcbyhtxezvoqt.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2R5bWd4Y2J5aHR4ZXp2b3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3MDQ1MjAsImV4cCI6MjAzNjI4MDUyMH0.WQrD5SINohTvNhgKOCdT0PVSjw5KzLp_PbV6p1vAzf0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Vector operations
export async function searchVectors(query: string, limit = 10) {
  // This would call the vector search function
  const { data, error } = await supabase
    .from('vectors')
    .select('*')
    .limit(limit);
  
  return { data, error };
}

export async function insertVector(content: string, metadata: any, embedding?: number[]) {
  const { data, error } = await supabase
    .from('vectors')
    .insert({
      content,
      metadata,
      embedding,
      created_at: new Date().toISOString(),
    });
  
  return { data, error };
}
