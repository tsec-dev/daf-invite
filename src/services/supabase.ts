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
    '.af.mil',
    '.army.mil',
    '.navy.mil',
    '.marines.mil',
    '.uscg.mil',
    '.spaceforce.mil',
    '.ussf.mil',
    '.osd.mil',
    '.defense.gov',
    '.disa.mil',
    '.dla.mil',
    '.dtra.mil',
    '.nga.mil',
    '.nro.mil',
    '.nsa.gov',
    '.socom.mil',
    '@tsec.dev' // Dev testing domain
  ];
  
  const emailLower = email.toLowerCase();
  return milDomains.some(domain => emailLower.endsWith(domain));
};