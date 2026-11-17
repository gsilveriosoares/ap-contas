import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from './config';

/** Um único cliente do Supabase para o app inteiro. */
@Injectable({ providedIn: 'root' })
export class Supabase {
  readonly client: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}
