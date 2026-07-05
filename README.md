# Hub — gestão de clientes, demandas e cronograma

Painel interno para gerenciar clientes, demandas e o cronograma de entregas.
É a metade "agência" do sistema: o Portal do Cliente (onde os clientes
acompanham seus projetos e abrem demandas) vive em um repositório separado,
compartilhando o mesmo projeto Supabase.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Storage) via `@supabase/ssr`
- `@hello-pangea/dnd` para o quadro Kanban de demandas
- `date-fns` para o calendário do Cronograma

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor do projeto, rode **nessa ordem**:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_redesign.sql` (substitui o pipeline antigo de
     demandas, remove o conceito de projetos e cria a tabela de anexos +
     bucket de Storage `demanda-attachments`)
3. Em **Project Settings → API Keys**, copie:
   - **Project URL** (aba **Data API**) → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (ou `anon public` em projetos antigos) →
     `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Secret key** (ou `service_role` em projetos antigos) →
     `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no client — usada para convites
     e upload de anexos)
4. Copie `.env.example` para `.env.local` e preencha os valores acima, além
   de `NEXT_PUBLIC_PORTAL_URL` (URL do Portal do Cliente — pode deixar
   `http://localhost:3001` enquanto o Portal não existe).
5. Crie seu usuário admin em **Authentication → Users → Add user**. Qualquer
   usuário autenticado que **não** esteja vinculado a um registro de
   `clients` é tratado como admin (ver função `is_admin()` na migration) —
   funciona bem para o único usuário interno do MVP.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`, faça login com o usuário admin criado no
Supabase.

## Modelo de dados

- **clients**: cadastro dos clientes da agência, com um campo de contexto
  livre ("Contexto / Estratégia") para registrar nicho, tom de voz,
  objetivos etc. Quando convidados, ganham um `auth_user_id` vinculado a um
  usuário do Supabase Auth — é esse vínculo que o Portal do Cliente usa para
  restringir o acesso de cada cliente aos seus próprios dados (via RLS).
- **demandas**: pedidos/tarefas de um cliente, com o pipeline:
  `recebida` → `em_producao` → `em_aprovacao` → `programar` → `concluido`.
  Têm uma data de entrega (`due_date`) e uma data de publicação
  (`publish_date`) — assim que a data de publicação é preenchida, a demanda
  aparece automaticamente no Cronograma naquele dia.
- **demanda_attachments**: arquivos (imagem/vídeo/PDF) anexados como entrega
  de uma demanda, com legenda opcional. Armazenados no bucket privado
  `demanda-attachments` do Supabase Storage; o Hub acessa via URLs assinadas
  geradas pelo client de service role.

## Cronograma

Tela dedicada por cliente: um seletor de cliente + calendário mensal
mostrando as demandas que já têm data de publicação definida. Clicar numa
demanda abre o mesmo painel de detalhe usado em Demandas, de onde dá pra
anexar a entrega final e escrever a legenda do post.

## Convite de clientes para o Portal

Ao cadastrar um cliente (ou depois, na tela de detalhe), é possível enviar um
convite por e-mail via Supabase Auth (`inviteUserByEmail`). O cliente recebe
um link mágico, define a senha e passa a acessar o Portal — não há
autocadastro aberto.

## Próximos passos sugeridos

- Portal do Cliente (repositório separado): login do cliente, visualização
  do cronograma e das demandas, criação de novas demandas.
- Papéis de equipe interna (hoje só existe o papel admin único).
- Comentários em demandas.
- Módulo financeiro e relatórios.
