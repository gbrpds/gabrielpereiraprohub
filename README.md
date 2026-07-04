# Hub — gestão de clientes, projetos e demandas

Painel interno para gerenciar clientes, projetos e demandas. É a metade
"agência" do sistema: o Portal do Cliente (onde os clientes acompanham seus
projetos e abrem demandas) vive em um repositório separado, compartilhando o
mesmo projeto Supabase.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth) via `@supabase/ssr`
- `@hello-pangea/dnd` para o quadro Kanban de demandas

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor do projeto, rode o conteúdo de
   `supabase/migrations/0001_init.sql`. Isso cria as tabelas `clients`,
   `projects`, `demandas`, os enums de status e as políticas de RLS.
3. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no client)
4. Copie `.env.example` para `.env.local` e preencha os valores acima, além
   de `NEXT_PUBLIC_PORTAL_URL` (URL do Portal do Cliente, usada no link de
   convite por e-mail — pode deixar `http://localhost:3001` enquanto o Portal
   não existe).
5. Crie seu usuário admin em **Authentication → Users → Add user** no painel
   do Supabase (e-mail + senha). Qualquer usuário autenticado que **não**
   esteja vinculado a um registro de `clients` é tratado como admin (ver
   função `is_admin()` na migration) — funciona bem para o único usuário
   interno do MVP.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`, faça login com o usuário admin criado no
Supabase.

## Modelo de dados

- **clients**: cadastro dos clientes da agência. Quando convidados, ganham um
  `auth_user_id` vinculado a um usuário do Supabase Auth — é esse vínculo que
  o Portal do Cliente usa para restringir o acesso de cada cliente aos seus
  próprios dados (via RLS).
- **projects**: projetos de um cliente, com status
  (`planejamento` → `em_andamento` → `pausado`/`concluido`).
- **demandas**: pedidos/tarefas abertos para um cliente (e opcionalmente
  ligados a um projeto), com o fluxo de status:
  `aberta` → `em_andamento` → `aguardando_aprovacao` → `aprovada_ajustes` →
  `concluida`.

## Convite de clientes para o Portal

Ao cadastrar um cliente (ou depois, na tela de detalhe), é possível enviar um
convite por e-mail via Supabase Auth (`inviteUserByEmail`). O cliente recebe
um link mágico, define a senha e passa a acessar o Portal — não há
autocadastro aberto.

## Próximos passos sugeridos

- Portal do Cliente (repositório separado): login do cliente, visualização
  do andamento do projeto, criação e acompanhamento de demandas.
- Papéis de equipe interna (hoje só existe o papel admin único).
- Comentários/anexos em demandas.
- Módulo financeiro e relatórios.
