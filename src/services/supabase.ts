import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not configured. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const validateMilEmail = (email: string): boolean => {
  const milDomains = [
    '.mil',
    '.gov',
    '.mil.mil',
    '.af.mil',
    '.army.mil',
    '.navy.mil',
    '.marines.mil',
    '.uscg.mil',
    '.spaceforce.mil',
    '.ussf.mil'
  ];
  
  const emailLower = email.toLowerCase();
  return milDomains.some(domain => emailLower.endsWith(domain));
};