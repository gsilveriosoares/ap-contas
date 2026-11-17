import { Injectable, computed, inject, signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';

/**
 * Login por link mágico / código de 6 dígitos enviado por e-mail.
 * O código serve para o app instalado no celular, que não abre o link do e-mail.
 */
@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly supabase = inject(Supabase).client;

  /** undefined = ainda verificando; null = sem login. */
  readonly sessao = signal<Session | null | undefined>(undefined);
  readonly email = computed(() => this.sessao()?.user.email ?? '');

  /** Resolve quando a sessão inicial já foi lida (inclui o retorno do link mágico). */
  readonly pronto: Promise<Session | null>;

  constructor() {
    this.pronto = this.supabase.auth.getSession().then(({ data }) => {
      this.sessao.set(data.session);
      return data.session;
    });
    this.supabase.auth.onAuthStateChange((_evento, sessao) => this.sessao.set(sessao));
  }

  async enviarLink(email: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/inicio` },
    });
    if (error) throw error;
  }

  async confirmarCodigo(email: string, codigo: string): Promise<void> {
    const { data, error } = await this.supabase.auth.verifyOtp({ email, token: codigo, type: 'email' });
    if (error) throw error;
    this.sessao.set(data.session);
  }

  async sair(): Promise<void> {
    await this.supabase.auth.signOut();
    this.sessao.set(null);
  }
}

/** Traduz os erros mais comuns do Supabase Auth. */
export function mensagemErroAuth(erro: unknown): string {
  const e = erro as { status?: number; code?: string; message?: string };
  const msg = e?.message ?? '';
  if (e?.status === 429 || e?.code === 'over_email_send_rate_limit')
    return 'Muitos e-mails em pouco tempo. Espere alguns minutos e tente de novo.';
  if (e?.code === 'signup_disabled' || /signups not allowed/i.test(msg))
    return 'Este e-mail não tem acesso ao ApContas.';
  if (e?.code === 'otp_expired' || /expired|invalid/i.test(msg)) return 'Código inválido ou vencido. Peça um novo.';
  return 'Não foi possível concluir agora. Confira a internet e tente de novo.';
}
