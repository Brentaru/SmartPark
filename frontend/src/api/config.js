export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
export const IS_SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
