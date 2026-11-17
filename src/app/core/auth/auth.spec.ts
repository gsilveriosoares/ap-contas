import { lerLinkDeAcesso } from './auth';

describe('lerLinkDeAcesso', () => {
  it('lê o token do link do e-mail', () => {
    const link =
      'https://pkjxjpizsuknbdksxgna.supabase.co/auth/v1/verify?token=abc123def&type=magiclink&redirect_to=https://ap-contas.gsilveriosoares.workers.dev';
    expect(lerLinkDeAcesso(link)).toEqual({ token: 'abc123def', tipo: 'magiclink' });
    expect(lerLinkDeAcesso(`Sign in ( ${link} )`)?.token).toBe('abc123def');
    expect(lerLinkDeAcesso(link.replace('magiclink', 'signup'))?.tipo).toBe('signup');
  });

  it('ignora o que não é link de acesso', () => {
    expect(lerLinkDeAcesso('123456')).toBeNull();
    expect(lerLinkDeAcesso('https://exemplo.com/?x=1')).toBeNull();
    expect(lerLinkDeAcesso('https://x.supabase.co/auth/v1/verify?token=a&type=recovery')).toBeNull();
  });
});
