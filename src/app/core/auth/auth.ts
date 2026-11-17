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
      // Endereço raiz = "Site URL" do Supabase, que já é permitido sem configurar mais nada
      options: { emailRedirectTo: location.origin },
    });
    if (error) throw error;
  }

  /**
   * Confirma o acesso com o código de 6 dígitos ou com o link do e-mail colado no app.
   * O link serve para o app instalado no iPhone, que não abre links do e-mail.
   */
  async confirmarCodigo(email: string, entrada: string): Promise<void> {
    const link = lerLinkDeAcesso(entrada);
    const { data, error } = link
      ? await this.supabase.auth.verifyOtp({ token_hash: link.token, type: link.tipo })
      : await this.supabase.auth.verifyOtp({ email, token: entrada.replace(/\D/g, ''), type: 'email' });
    if (error) throw error;
    this.sessao.set(data.session);
  }

  async sair(): Promise<void> {
    await this.supabase.auth.signOut();
    this.sessao.set(null);
  }
}

const TIPOS_LINK = ['magiclink', 'signup', 'email'] as const;
type TipoLink = (typeof TIPOS_LINK)[number];

/** Extrai o token do link do e-mail (".../auth/v1/verify?token=...&type=magiclink"). null se não for um link. */
export function lerLinkDeAcesso(texto: string): { token: string; tipo: TipoLink } | null {
  const inicio = texto.indexOf('http');
  if (inicio < 0) return null;
  try {
    const url = new URL(texto.slice(inicio).trim().split(/\s/)[0]);
    const token = url.searchParams.get('token');
    const tipo = url.searchParams.get('type') ?? 'magiclink';
    if (!token || !TIPOS_LINK.includes(tipo as TipoLink)) return null;
    return { token, tipo: tipo as TipoLink };
  } catch {
    return null;
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
