import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

/** Só entra logado; senão vai para /entrar. */
export const exigeLogin: CanActivateFn = async () => {
  const router = inject(Router);
  const sessao = await inject(Auth).pronto;
  return sessao ? true : router.parseUrl('/entrar');
};

/** Quem já está logado não precisa ver a tela de entrar. */
export const soSemLogin: CanActivateFn = async () => {
  const router = inject(Router);
  const sessao = await inject(Auth).pronto;
  return sessao ? router.parseUrl('/inicio') : true;
};
