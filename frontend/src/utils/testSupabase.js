import { createClient } from '@supabase/supabase-js';

// Test Supabase Connection
const supabaseUrl = 'https://hxinvbaafgclfdjviztk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aW52YmFhZmdjbGZkanZpenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzg5MjcsImV4cCI6MjA4MDY1NDkyN30.p0epC9bXTpGXF8fN_CL7H5uxbUirNNkIcJ-JHk-Cohs';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Test 1: Check if we can connect
    console.log('\n📡 Test 1: Basic Connection');
    const { data: healthCheck, error: healthError } = await supabase
      .from('_health')
      .select('*')
      .limit(1);
    
    if (healthError) {
      console.log('⚠️ Health check failed (expected if table doesn\'t exist):', healthError.message);
    } else {
      console.log('✅ Basic connection successful');
    }
    
    // Test 2: List buckets
    console.log('\n📦 Test 2: List Storage Buckets');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Failed to list buckets:', bucketsError);
      return {
        success: false,
        error: bucketsError,
        message: 'Cannot connect to Supabase Storage. Check your project URL and API key.'
      };
    }
    
    console.log('✅ Successfully connected to Storage!');
    console.log('📋 Available buckets:', buckets?.map(b => b.name) || 'none');
    
    // Test 3: Check for smartpark-profiles bucket
    const targetBucket = buckets?.find(b => b.name === 'smartpark-profiles');
    
    if (targetBucket) {
      console.log('✅ Found "smartpark-profiles" bucket!');
      console.log('   - Public:', targetBucket.public);
      console.log('   - Created:', targetBucket.created_at);
      
      return {
        success: true,
        bucketExists: true,
        isPublic: targetBucket.public,
        buckets: buckets
      };
    } else {
      console.log('⚠️ "smartpark-profiles" bucket NOT found');
      console.log('📝 You need to create it in Supabase Dashboard');
      
      return {
        success: true,
        bucketExists: false,
        availableBuckets: buckets?.map(b => b.name) || [],
        message: 'Bucket "smartpark-profiles" does not exist. Please create it.'
      };
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to connect to Supabase. Check console for details.'
    };
  }
};

// Auto-run test when imported
testSupabaseConnection();
