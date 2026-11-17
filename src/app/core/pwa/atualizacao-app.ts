import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/** Intervalo entre verificações enquanto o app fica aberto. */
const INTERVALO_VERIFICACAO_MS = 30 * 60 * 1000;

/**
 * Avisa quando há uma versão nova publicada.
 * O service worker já baixa a versão nova em segundo plano; aqui só
 * mostramos o aviso e recarregamos quando a pessoa toca em "Atualizar".
 * No `npm start` o service worker fica desligado, então nada acontece.
 */
@Injectable({ providedIn: 'root' })
export class AtualizacaoApp {
  private readonly sw = inject(SwUpdate);

  /** true quando a versão nova já foi baixada e está pronta. */
  readonly disponivel = signal(false);

  constructor() {
    if (!this.sw.isEnabled) return;

    const inscricao = this.sw.versionUpdates
      .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
      .subscribe(() => this.disponivel.set(true));

    // App instalado costuma ficar aberto em segundo plano: verifica ao voltar e de tempos em tempos.
    const verificar = () => {
      if (document.visibilityState === 'visible') this.sw.checkForUpdate().catch(() => {});
    };
    document.addEventListener('visibilitychange', verificar);
    const timer = setInterval(verificar, INTERVALO_VERIFICACAO_MS);

    // Versão corrompida no aparelho (raro): recarrega para pegar a do servidor.
    const inscricaoErro = this.sw.unrecoverable.subscribe(() => location.reload());

    inject(DestroyRef).onDestroy(() => {
      inscricao.unsubscribe();
      inscricaoErro.unsubscribe();
      document.removeEventListener('visibilitychange', verificar);
      clearInterval(timer);
    });
  }

  async atualizar(): Promise<void> {
    try {
      await this.sw.activateUpdate();
    } finally {
      location.reload();
    }
  }

  dispensar(): void {
    this.disponivel.set(false);
  }
}
