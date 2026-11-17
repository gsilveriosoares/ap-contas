/**
 * Conexão com o Supabase.
 * A chave "publishable" é pública por natureza (vai no site de qualquer jeito);
 * quem protege os dados são as regras RLS em supabase/001_contas.sql.
 * NUNCA coloque aqui a chave secret / service_role.
 */
export const SUPABASE_URL = 'https://pkjxjpizsuknbdksxgna.supabase.co';
export const SUPABASE_CHAVE_PUBLICA = 'sb_publishable_sfVX_gJs2BSVGEka0T3rBA_KlLASLM6';
