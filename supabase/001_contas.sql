-- ApContas · fase 1: contas a pagar
-- Cole no Supabase → SQL Editor → New query → Run. Pode rodar de novo sem problema.

create table if not exists public.contas (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  descricao       text not null check (char_length(descricao) between 1 and 80),
  -- dinheiro sempre em centavos (inteiro) para não ter erro de arredondamento
  valor_centavos  integer not null check (valor_centavos > 0),
  vencimento      date not null,
  categoria       text not null default 'outros'
                  check (categoria in ('moradia','mercado','servicos','cartao','transporte','saude','educacao','lazer','outros')),
  paga_em         date,
  observacao      text check (char_length(observacao) <= 500),
  -- contas criadas juntas (todo mês ou parceladas) dividem o mesmo serie_id
  serie_id        uuid,
  parcela         smallint check (parcela > 0),
  total_parcelas  smallint check (total_parcelas > 0),
  criada_em       timestamptz not null default now()
);

create index if not exists contas_usuario_vencimento on public.contas (user_id, vencimento);
create index if not exists contas_serie on public.contas (serie_id) where serie_id is not null;

-- Segurança: cada pessoa só vê e mexe nas próprias contas
alter table public.contas enable row level security;

drop policy if exists "ver as proprias contas" on public.contas;
create policy "ver as proprias contas" on public.contas
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "criar as proprias contas" on public.contas;
create policy "criar as proprias contas" on public.contas
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "alterar as proprias contas" on public.contas;
create policy "alterar as proprias contas" on public.contas
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "excluir as proprias contas" on public.contas;
create policy "excluir as proprias contas" on public.contas
  for delete to authenticated using (user_id = (select auth.uid()));
