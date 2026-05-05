import { createClient } from '@supabase/supabase-js';
import { IS_SUPABASE_CONFIGURED, SUPABASE_ANON_KEY, SUPABASE_URL } from '../api/config';

export const testSupabaseConnection = async () => {
  if (!IS_SUPABASE_CONFIGURED) {
    return {
      success: false,
      message: 'Supabase is not configured.',
    };
  }

  console.log('Testing Supabase Connection...');
  console.log('URL:', SUPABASE_URL);
  console.log('Key (first 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { error: healthError } = await supabase
      .from('_health')
      .select('*')
      .limit(1);

    if (healthError) {
      console.log('Health check failed (expected if table does not exist):', healthError.message);
    } else {
      console.log('Basic connection successful');
    }

    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('Failed to list buckets:', bucketsError);
      return {
        success: false,
        error: bucketsError,
        message: 'Cannot connect to Supabase Storage. Check your project URL and API key.',
      };
    }

    console.log('Successfully connected to Storage.');
    console.log('Available buckets:', buckets?.map((bucket) => bucket.name) || 'none');

    const targetBucket = buckets?.find((bucket) => bucket.name === 'smartpark-profiles');

    if (targetBucket) {
      console.log('Found smartpark-profiles bucket.');
      console.log('Public:', targetBucket.public);
      console.log('Created:', targetBucket.created_at);

      return {
        success: true,
        bucketExists: true,
        isPublic: targetBucket.public,
        buckets,
      };
    }

    console.log('smartpark-profiles bucket was not found.');

    return {
      success: true,
      bucketExists: false,
      availableBuckets: buckets?.map((bucket) => bucket.name) || [],
      message: 'Bucket "smartpark-profiles" does not exist. Please create it.',
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to connect to Supabase. Check console for details.',
    };
  }
};
